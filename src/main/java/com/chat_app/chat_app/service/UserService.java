package com.chat_app.chat_app.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.request.LoginRequest;
import com.chat_app.chat_app.payload.request.RegisterRequest;
import com.chat_app.chat_app.payload.response.AuthenticationResponse;
import com.chat_app.chat_app.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public AuthenticationResponse registerUser(RegisterRequest request){

		if (userRepository.existsByUsername(request.getUsername())){
			throw new IllegalArgumentException("Username is already taken : " + request.getUsername());
		}

		var user = User.builder()
			.firstName(request.getFirstName())
			.lastName(request.getLastName())
			.username(request.getUsername())
			.password(passwordEncoder.encode(request.getPassword()))
			.role(Role.USER)
			.build();
		
		User savedUser = userRepository.save(user);
		var jwtToken = jwtService.generateToken(savedUser);
		return AuthenticationResponse.builder()
				.token(jwtToken)
				.build();
			
	}

	public AuthenticationResponse loginUser(LoginRequest request){
		authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(
				request.getUsername(),
				request.getPassword())
		);

		var user = userRepository.findByUsername(request.getUsername())
			.orElseThrow(() -> new UsernameNotFoundException("The given " + request.getUsername() + " does not exist"));

		var jwtToken = jwtService.generateToken(user);
	
		return AuthenticationResponse.builder()
			.token(jwtToken)
			.build();
	}
}
