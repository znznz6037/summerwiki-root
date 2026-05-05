package com.psb.summerwiki_api.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList("JWT"))
            .components(new Components()
                .addSecuritySchemes("JWT", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")))
            .info(new io.swagger.v3.oas.models.info.Info().title("SummerWiki API").description("SummerWiki API 명세서").version("1.0"));
    }
}
