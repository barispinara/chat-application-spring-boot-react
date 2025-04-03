package com.authentication.authentication.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.authentication.authentication.model.Role;
import com.authentication.authentication.model.User;
import com.authentication.authentication.payload.request.LoginRequest;
import com.authentication.authentication.payload.request.RegisterRequest;
import com.authentication.authentication.payload.response.AuthenticationResponse;
import com.authentication.authentication.repository.UserRepository;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private JwtService jwtService;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private AuthenticationManager authenticationManager;

	@InjectMocks
	private UserService userService;

	static RegisterRequest registerRequest;
	static LoginRequest loginRequest;
	static User dbUser;

	@BeforeAll
	static void setup() {

		registerRequest = RegisterRequest.builder()
				.username("admin")
				.firstName("admin")
				.lastName("test")
				.password("testasd123")
				.build();
		
		loginRequest = LoginRequest.builder()
				.username("admin")
				.password("testasd123")
				.build();

		dbUser = User.builder()
				.id(1L)
				.username("admin")
				.firstName("admin")
				.lastName("test")
				.role(Role.USER)
				.password("encoded")
				.build();
	}

	@Test
	public void registerUserWhenUsernameDoesNotExist() {
		when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
		when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded");
		when(userRepository.save(isA(User.class))).thenReturn(dbUser);
		when(jwtService.generateToken(dbUser)).thenReturn("jwtToken12345");

		AuthenticationResponse authResponse = userService.registerUser(registerRequest);

		assertEquals("jwtToken12345", authResponse.getToken());

	}

	@Test
	public void registerUserWhenUsernameExists() {
		when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(true);

		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
				() -> userService.registerUser(registerRequest));

		assertTrue(exception.getMessage().equals("Username is already taken : " + registerRequest.getUsername()));
	}

	@Test
	public void loginUserWithRightCredentials() {
		Authentication authentication = mock(Authentication.class);

		when(authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()))
			).thenReturn(authentication);
		when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(dbUser));
		when(jwtService.generateToken(dbUser)).thenReturn("jwtToken12345");

		AuthenticationResponse authResponse = userService.loginUser(loginRequest);

		assertEquals("jwtToken12345", authResponse.getToken());
		verify(authenticationManager).authenticate(any(Authentication.class));
		
	}

	@Test
	public void loginUserWithBadCredentials() {
		when(authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()))
			).thenThrow(new BadCredentialsException("Bad Credentials"));
		
		BadCredentialsException exception = assertThrows(BadCredentialsException.class,
			() -> userService.loginUser(loginRequest));
		
		assertTrue(exception.getMessage().equals("Bad Credentials"));
	}

}
