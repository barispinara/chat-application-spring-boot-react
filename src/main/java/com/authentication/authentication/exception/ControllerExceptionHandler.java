package com.authentication.authentication.exception;

import java.util.Date;
import java.util.stream.Collectors;

import static org.springframework.util.StringUtils.capitalize;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.ui.Model;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.authentication.authentication.payload.response.ErrorMessage;


@ControllerAdvice
public class ControllerExceptionHandler {

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorMessage> illegalArgumentException(IllegalArgumentException ex, WebRequest request){
		ErrorMessage message = ErrorMessage.builder()
			.statusCode(HttpStatus.BAD_REQUEST.value())
			.timeStamp(new Date())
			.message(ex.getMessage())
			.description(request.getDescription(false))
			.build();
		
		return new ResponseEntity<ErrorMessage>(message, HttpStatus.BAD_REQUEST);

	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ErrorMessage> authenticationException(AuthenticationException ex, WebRequest request){
		ErrorMessage message = ErrorMessage.builder()
			.statusCode(HttpStatus.FORBIDDEN.value())
			.timeStamp(new Date())
			.message("Invalid username or password")
			.description(request.getDescription(false))
			.build();
		
		return new ResponseEntity<ErrorMessage>(message, HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorMessage> validationException(MethodArgumentNotValidException ex, WebRequest request){
        
		String errorsAsJson = ex.getBindingResult().getFieldErrors()
                .stream()
                .collect(Collectors.groupingBy(
                        FieldError::getField,
                        Collectors.mapping(FieldError::getDefaultMessage, Collectors.toList())
                ))
                .entrySet()
                .stream()
                .map(entry -> "\"" + capitalize(entry.getKey()) + "\": " + entry.getValue())
                .collect(Collectors.joining(", ", "{", "}"));

		ErrorMessage message = ErrorMessage.builder()
			.statusCode(HttpStatus.BAD_REQUEST.value())
			.timeStamp(new Date())
			.message(errorsAsJson)
			.description(request.getDescription(false))
			.build();
		
		return new ResponseEntity<ErrorMessage>(message, HttpStatus.BAD_REQUEST);
	}


	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorMessage> globalExceptionHandler(Exception ex, WebRequest request){
		ErrorMessage message = ErrorMessage.builder()
			.statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
			.timeStamp(new Date())
			.message(ex.getMessage())
			.description(request.getDescription(false))
			.build();

		return new ResponseEntity<ErrorMessage>(message, HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@ExceptionHandler(NoResourceFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public String noResourceFoundException(NoResourceFoundException ex, Model model){
		model.addAttribute("errorMessage", "The resource you are looking for could not be found.");
		return "error";
	}
}
