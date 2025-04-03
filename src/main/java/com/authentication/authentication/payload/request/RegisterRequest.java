package com.authentication.authentication.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
	@NotBlank(message = "First name is required.")
	private String firstName;
	
	@NotBlank(message = "Last name is required.")
	private String lastName;
	
	@NotBlank(message = "Username is required.")
	@Size(min=3 , message = "Username must be at least 3 characters long.")
	private String username;
	
	@NotBlank(message = "Password is required.")
	@Size(min = 6, message = "Password must be at least 6 characters long.")
	@Pattern(
        regexp = "^(?=.*[0-9]).*$",
        message = "Password must contain at least one digit."
    )
	private String password;	
	
}
