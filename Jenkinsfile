pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/znznz6037/summerwiki-api.git'
            }
        }
        
        stage('Static Analysis') {
            steps {
                // 젠킨스 시스템 설정에 등록한 이름을 사용합니다.
                withSonarQubeEnv('SonarQube-Server') {
                    sh './gradlew sonar \
                        -Dsonar.projectKey=summerwiki-api \
                        -Dsonar.host.url=http://localhost:9000 \
                        -Dsonar.login=$SONAR_AUTH_TOKEN'
                }
            }
        }
        
        stage('Build') {
            steps {
                sh './gradlew clean bootJar'
            }
        }
    }
}