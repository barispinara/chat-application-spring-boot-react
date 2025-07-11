package com.chat_app.chat_app.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

  private final String SECRET_KEY;
  private final int EXPIRATION_MS;

  public JwtService(@Value("${jwt.secret}") String secretKey,
      @Value("${jwt.expirationMs}") int expirationMs) {
    this.SECRET_KEY = secretKey;
    this.EXPIRATION_MS = expirationMs;
  }

  public String extractUsername(String jwtToken) {
    return extractClaim(jwtToken, Claims::getSubject);
  }

  public <T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(jwtToken);
    return claimsResolver.apply(claims);
  }

  public String generateToken(UserDetails userDetails) {
    return generateToken(new HashMap<>(), userDetails);
  }

  public String generateToken(
      Map<String, Object> extraClaims,
      UserDetails userDetails) {
    return Jwts
        .builder()
        .setClaims(extraClaims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();

  }

  public boolean isTokenValid(String jwtToken, UserDetails userDetails) {
    final String username = extractUsername(jwtToken);
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(jwtToken);
  }

  private boolean isTokenExpired(String jwtToken) {
    return extractExpiration(jwtToken).before(new Date());
  }

  private Date extractExpiration(String jwtToken) {
    return extractClaim(jwtToken, Claims::getExpiration);
  }

  private Claims extractAllClaims(String jwtToken) {
    return Jwts
        .parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(jwtToken)
        .getBody();
  }

  private Key getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
    return Keys.hmacShaKeyFor(keyBytes);
  }

}
