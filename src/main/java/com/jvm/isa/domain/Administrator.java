package com.jvm.isa.domain;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
// ovom anotacijom se navodi vrednost diskriminatorske kolone koja vazi za
// objekte ove klase
@DiscriminatorValue("AD")
public class Administrator extends User {

	@ColumnDefault("''")
	@Column(name = "first_name", unique = false, nullable = false)
	private String firstName;

	@ColumnDefault("''")
	@Column(name = "last_name", unique = false, nullable = false)
	private String lastName;

	@ColumnDefault("''")
	@Column(name = "email", unique = false, nullable = false)
	private String email;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cultural_institution_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
	private CulturalInstitution culturalInstitution;

	public Administrator() {
		super();
	}
	
	public Administrator(String username, String password, String firstName, String lastName, String email, UserType userType, CulturalInstitution ci) {
	super(username, password, userType, UserStatus.PENDING);

		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.culturalInstitution = ci;
		
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public CulturalInstitution getCulturalInstitution() {
		return culturalInstitution;
	}

	public void setCulturalInstitution(CulturalInstitution culturalInstitution) {
		this.culturalInstitution = culturalInstitution;
	}

}
