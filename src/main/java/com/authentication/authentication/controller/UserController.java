package com.authentication.authentication.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.authentication.authentication.payload.request.LoginRequest;
import com.authentication.authentication.payload.request.RegisterRequest;
import com.authentication.authentication.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Validated
public class UserController {

	private final UserService userService;

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(
			@Valid @RequestBody RegisterRequest request
	) {
		
		return ResponseEntity.ok(userService.registerUser(request));
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(
			@Valid @RequestBody LoginRequest request
	) {
		
		return ResponseEntity.ok(userService.loginUser(request));
	}
	
}
