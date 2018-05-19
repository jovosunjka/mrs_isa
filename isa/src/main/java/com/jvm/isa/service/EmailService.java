package com.jvm.isa.service;

import javax.mail.MessagingException;

import com.jvm.isa.domain.RegisteredUser;

public interface EmailService {
	final int LENGTH_OF_ID_FOR_ACTIVATION = 20;
	
	String generateIdForActivation();
	
	void sendActivationEmailAsync(RegisteredUser user) throws MessagingException;
	void sendNewAdminEmailAsync(String username, String password, String email, String typeOfAdmin) throws MessagingException;
	
	boolean activateAccount(String idForActivation);

	void sendUserChangedEmail(String username, String password, String email) throws MessagingException;
}
