package com.authentication.authentication.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.authentication.authentication.model.Role;
import com.authentication.authentication.model.User;
import com.authentication.authentication.payload.request.LoginRequest;
import com.authentication.authentication.payload.request.RegisterRequest;
import com.authentication.authentication.payload.response.AuthenticationResponse;
import com.authentication.authentication.repository.UserRepository;

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
