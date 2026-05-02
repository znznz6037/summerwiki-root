# 1단계: 리액트 빌드 (Node 환경)
FROM node:22 AS frontend-build
WORKDIR /app/frontend

# 의존성 설치 (캐싱 활용을 위해 package.json만 먼저 복사)
COPY summerwiki-web/package*.json ./
RUN npm install --legacy-peer-deps

# 전체 소스 복사 및 빌드
COPY summerwiki-web/ ./
RUN npm run build 

# 2단계: 스프링 빌드 (Gradle 환경)
FROM gradle:8.5-jdk21 AS spring-build
WORKDIR /app/backend

# Gradle 래퍼 및 설정 파일 복사 (캐싱 활용)
COPY summerwiki-api/gradlew ./
COPY summerwiki-api/gradle ./gradle
COPY summerwiki-api/build.gradle ./
COPY summerwiki-api/settings.gradle ./

# 의존성 먼저 다운로드 (코드 변경 시에도 빌드 속도 유지)
RUN ./gradlew dependencies --no-daemon

# 스프링 소스 복사
COPY summerwiki-api/src ./src

# 리액트 빌드 결과물(dist/)을 스프링 static 폴더로 복사
# (Vite의 기본 빌드 결과물은 dist 폴더입니다)
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/

# 빌드 실행 (테스트 제외)
RUN chmod +x gradlew
RUN ./gradlew bootJar -x test --no-daemon

# 3단계: 최종 실행 환경 (경량화된 JRE 사용)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# 빌드된 jar 파일 복사 (plain jar가 아닌 실행 가능한 jar 선택을 위해 필터링)
COPY --from=spring-build /app/backend/build/libs/*-SNAPSHOT.jar app.jar

# 컨테이너 포트 노출 (Spring 기본 8080)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]