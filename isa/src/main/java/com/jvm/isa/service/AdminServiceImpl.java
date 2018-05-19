package com.jvm.isa.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jvm.isa.domain.Administrator;
import com.jvm.isa.domain.CulturalInstitution;
import com.jvm.isa.domain.Requisite;
import com.jvm.isa.domain.User;
import com.jvm.isa.repository.RequisiteRepository;

@Service
public class AdminServiceImpl implements AdminService {

	@Autowired
	private UserService userService;
	
	@Autowired
	private RequisiteRepository requisiteRepository;
	
	@Autowired
	private CulturalInstitutionService culturalInstitutionService; 

	@Override
	public boolean register(User admin) {
			return userService.registrate(admin);
	}

	@Override
	public boolean exists(String username) {

		return userService.exists(username);

	}
	
	@Override
	public boolean existsRequisite(String name) {
		return requisiteRepository.findByName(name) != null;
	}

	/*@Override
	public Administrator getUser(String username, String password) {

		return adminRepository.findByUsernameAndPassword(username, password);
	}*/

	
	/*
	 * return value:
	 *  0 - Everything is right
	 *  1 - All fields are not filled
	 *  2 - This username already exists
	 *  3 - You did not enter the correct old password
	 *  4 - You are not the first to enter the same new password the second time
	 *  5 - Incorrect email
	 * */
	@Override
	public int validAdmin(Administrator oldAdmin, String username, String oldPassword, String newPassword,
			String repeatNewPassword, String firstName, String lastName, String email) {
		
		if (firstName.equals("") || lastName.equals("")) return 1;
		
		return validSystemAdmin(oldAdmin, username, oldPassword, newPassword, repeatNewPassword, email);
	}

	/*
	 * return value:
	 *  0 - Everything is right
	 *  1 - All fields are not filled
	 *  2 - This username already exists
	 *  3 - You did not enter the correct old password
	 *  4 - You are not the first to enter the same new password the second time
	 *  5 - Incorrect email
	 * */
	@Override
	public int validSystemAdmin(User oldAdmin, String username, String oldPassword, String newPassword, String repeatNewPassword, String email) {
		if(newPassword.equals("") ^ repeatNewPassword.equals("")) return 0;
		
		if (email.equals(""))
			return 1;
		
		if(!EmailValidator.getInstance().isValid(email)) return 5;
		
		return validChangedUsernameAndPassword(oldAdmin, username, oldPassword, newPassword, repeatNewPassword);
		
	}
	
	
	/*
	 * return value:
	 *  0 - Everything is right
	 *  1 - All fields are not filled
	 *  2 - This username already exists
	 *  3 - You did not enter the correct old password
	 *  4 - You are not the first to enter the same new password the second time
	 * */
	@Override
	public int validChangedUsernameAndPassword(User oldAdmin, String username, String oldPassword, String newPassword,
			String repeatNewPassword) {
		if(newPassword.equals("") ^ repeatNewPassword.equals("")) return 1;
		
		if (username.equals("") || oldPassword.equals(""))
			return 1;
		
		if (oldAdmin != null) {
			if (userService.exists(username) && !oldAdmin.getUsername().equals(username)) {
				return 2;
			}
			
		} 
		else {
			if (userService.exists(username)) return 2;
		}
		
		if (!oldAdmin.getPassword().equals(oldPassword))
			return 3;

		if (!newPassword.equals(repeatNewPassword))
			return 4;

		return 0;
	}
	
	@Override
	public int correctRequisite(String name, String description, String priceStr, String culturalInstitutionName,
			String showing) {
		
		if(culturalInstitutionName == null || showing == null) {
			return 0;
		}
		
		if (name.equals("") || description.equals("") || priceStr.equals("") || culturalInstitutionName.equals("")
				|| showing.equals("")) {
			return 0;
		}

		if (existsRequisite(name)) {
			return 1;
		}

		double price;
		try {
			price = Double.parseDouble(priceStr);
		} catch (Exception e) {
			return 2;
		}

		if (price < 0) {
			return 3;
		}

		CulturalInstitution cInstitution = culturalInstitutionService.getCulturalInstitution(culturalInstitutionName);
		if (cInstitution == null) {
			return 4;
		}

		if (!cInstitution.containsShowing(showing)) {
			return 5;
		}

		return 6;

	}

	@Override
	public boolean addRequisite(Requisite requisite) {
		try {
			requisiteRepository.save(requisite);
		} catch (Exception e) {
			return false;
		}

		return true;
	}

	@Override
	public CulturalInstitution getCulturalInstitution(String culturalInstitutionName) {
		return culturalInstitutionService.getCulturalInstitution(culturalInstitutionName);
	}

	@Override
	public ArrayList<String> getCulturalInstitutions() {
		return culturalInstitutionService.getCulturalInstitutions();
	}

	@Override
	public ArrayList<String> getShowings(String culturalInstitutionName) {
		return culturalInstitutionService.getShowings(culturalInstitutionName);
	}

	@Override
	public List<Requisite> getRequisites() {
		return requisiteRepository.findAll();
	}

}
