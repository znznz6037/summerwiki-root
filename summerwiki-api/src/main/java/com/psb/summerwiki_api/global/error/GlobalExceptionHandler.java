package com.psb.summerwiki_api.global.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.psb.summerwiki_api.global.common.ApiResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
		String message = ex.getMessage();
		if (message != null && message.toLowerCase().contains("not found")) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(message));
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(message));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Object>> handleException(Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Internal server error"));
	}

}
