package com.jvm.isa.service;

import java.util.ArrayList;
import java.util.List;

import com.jvm.isa.domain.CulturalInstitution;
import com.jvm.isa.domain.CulturalInstitutionType;

public interface CulturalInstitutionService {
	
	boolean exists(String name);
	
	boolean save(CulturalInstitution ci);
	
	CulturalInstitution getCulturalInstitution(String name);

	List<CulturalInstitution> getCulturalInstitutionsByType(CulturalInstitutionType type);
	
	ArrayList<String> getCulturalInstitutions();
	
	ArrayList<String> getShowings(String culturalInstitutionName);
	
	boolean delete(CulturalInstitution ci);
}
