var addNewCulturalInstitutionURL = "/myapp/administrators/sys_admin/add_new_cultural_institution";
var updateCulturalInstitutionURL = "/myapp/administrators/sys_admin/update_cultural_institution";
var deleteCulturalInstitutionURL = "/myapp/administrators/sys_admin/delete_cultural_institution";
var showCulturalInstitutionsPath = "/myapp/home_page/cultural_institutions";
//var uploadCulturalInstitutionImageURL = "/myapp/administrators/admin_cultural_institution/upload_cultural_institution_image";

var cultural_institutions = null;

$(document).on("click", "#cinemas_div", function(event)
{
	var logged = isLogged();
	if(logged)
	{
        //call from cultural administrator page
        // TO DO: dodaj dodavanje u history za back dugme!
        deleteAllExceptFirst();
        $("#center").append('<div><div id="search_bar"></div><div id="cultural_institutions"></div></div>');
        get_data_extended('0');
    }
    else
    {
        // call from home page
        if(window.history.pushState)
        {
            window.history.pushState(null, null, $(this).attr('href')); // set URL
        }
        $("#center").html('<div><div id="search_bar"></div><div id="cultural_institutions"></div></div>');
        get_data("0");
    }
});

$(document).on("click", "#theaters_div", function(event)
{
	var logged = isLogged();
	if(logged)
	{
        //call from cultural administrator page
        // TO DO: dodaj dodavanje u history za back dugme!
        deleteAllExceptFirst();
        $("#center").append('<div><div id="search_bar"></div><div id="cultural_institutions"></div></div>');
        get_data_extended('1');
    }
    else
    {
        // call from home page
        if(window.history.pushState)
        {
            window.history.pushState(null, null, $(this).attr('href')); // set URL
        }
        $("#center").html('<div><div id="search_bar"></div><div id="cultural_institutions"></div></div>');
        get_data("1");
    }
});

function showCinemas() {
	$("#title").html('CINEMAS &nbsp;&nbsp; <a href="/myapp/#/" class="a_home_page"> Home page </a> &nbsp; <a href="/myapp/#/users/registrate" class="a_registrate"> Registrate </a> &nbsp; <a href="/myapp/#/users/login" class="a_login" > Login </a> ');
	$("#center").load("html/partials/cultural_institutions.html", null, get_data("0"));
}

function showTheaters() {
	$("#title").html('THEATERS &nbsp;&nbsp; <a href="/myapp/#/" class="a_home_page"> Home page </a> &nbsp; <a href="/myapp/#/users/registrate" class="a_registrate"> Registrate </a> &nbsp; <a href="/myapp/#/users/login" class="a_login" > Login </a> ');
	$("#center").load("html/partials/cultural_institutions.html", null, get_data("1"));
}

function get_data(param)
{
	$.ajax({
	    type: "POST",
	    async: false,
		url:  showCulturalInstitutionsPath,
		data: JSON.stringify({"type" : param}),
		dataType : "json",
	    contentType: "application/json",
	    cache: false,
	    success: function(data)
	    {
			if(data)
			{
				put_data_in_html(data);
			}
			else
			{
				toastr.error("No data found!");
			}
	   },
		error : function(XMLHttpRequest, textStatus, errorThrown) {
					toastr.error("Ajax ERROR: " + errorThrown + ", STATUS: " + textStatus);
		}
	});
}

function get_data_extended(param)
{
	$.ajax({
	    type: "POST",
	    async: false,
		url:  showCulturalInstitutionsPath,
		data: JSON.stringify({"type" : param}),
		dataType : "json",
	    contentType: "application/json",
	    cache: false,
	    success: function(data)
	    {
			if(data)
			{
				put_data_in_html_extended(data);
			}
			else
			{
				toastr.error("No data found!");
			}
	   },
		error : function(XMLHttpRequest, textStatus, errorThrown) {
					toastr.error("Ajax ERROR: " + errorThrown + ", STATUS: " + textStatus);
		}
	});
}

function update_institution()
{
	var logged = isLogged();
	if (logged) 
	{	
		var button_id = this.id;
		var numb = button_id.match(/\d/g);
		numb = numb.join("");
		var ci = cultural_institutions[parseInt(numb)];
		
		deleteAllExceptFirst();
		
		$("#center").append(
				'<div class="image_preview"><img alt="You did not select an image" src="#" id="id_img" class="previewing" /></div> \
				<form id="id_update_cultural_institution_form"> \
				<table> \
					<tr><td><label for="id_institution_name">Name:</label></td><td><input type="text" name="name" id="id_institution_name" value="' + ci.name + '" /></td></tr> \
					<tr><td><label for="id_address">Address:</label></td><td><input type="text" name="address" id="id_address" value="' + ci.address + '" /></td></tr> \
					<tr><td><label for="id_description">Description:</label></td><td><input type="text" name="description" id="id_description" value="' + ci.description + '" /></td></tr> \
					<tr>  <td><label for="id_cultural_institution_image">Cultural institution image:</label></td>  <td><input type="file" name="image" id="id_cultural_institution_image" name="image" class="id_image" accept=".gif, .jpg, .png" /></td>  </tr> \
					<tr><td colspan="2"><input type="hidden" name="old_name" id="id_institution_old_name" value="' + ci.name + '" /></td></tr> \
				</table> \
				<div align="center"><input type="button" id="id_btn_update_institution" class="buttons" value="Update institution"/> \
				</div> \
				<br/> \
			</form>');
		
		loadAndSetImage("cultural_institution_" + ci.name, "id_img");
		$('.previewing').width($('.previewing').parent().width());
		$('.previewing').height('230px');
		
		$("#id_btn_update_institution").click(function(event) {
			event.preventDefault();
			
			updateCulturalInstitutionAjax(ci.name, ci.type);
		});
	}
	else
	{
		$("#center").load("html/partials/login.html", null, loadLoginComplete);
	}
}

function updateCulturalInstitutionAjax(old_name, type)
{
	var name = $("#id_institution_name").val();
	var address = $("#id_address").val();
	var description = $("#id_description").val();

	if(name == "" || address == "" || description == "") {
		toastr.error("All fields must be filled!");
		return;
	}

	$.ajax({ 
	    type: "POST",
		url:  updateCulturalInstitutionURL,
	    data: new FormData($("#id_update_cultural_institution_form")[0]),
	    dataType: "json", 
	    enctype: 'multipart/form-data',
	    processData: false,
	    contentType: false,
	    cache: false,
	    success: function(success) {
	    	if(success) {
	    		toastr.success("You have successfully updated institution!");
	    		if(type == "CINEMA")
	    		{
	    	        deleteAllExceptFirst();
	    	        $("#center").append('<div><div id="search_bar"></div><div id="cultural_institutions"></div></div>');
	    	        get_data_extended('0');
	    		}
	    		if(type == "THEATER")
	    		{
	    	        deleteAllExceptFirst();
	    	        $("#center").append('<div><div id="search_bar"></div><div id="cultural_institutions"></div></div>');
	    	        get_data_extended('1');
	    		}
	    	}
	    	else {
	    		toastr.error("Wrong data!"); 
	    	}
	   },
		error : function(XMLHttpRequest, textStatus, errorThrown) { 
					toastr.error("Ajax ERROR: " + errorThrown + ", STATUS: " + textStatus); 
		}
	});
}

function addCulturalInstitution(type)
{
	var logged = isLogged();
	if (logged) { // ako je  ulogovan

		deleteAllExceptFirst();
		
		$("#center").append(
				'<div class="image_preview"><img alt="You did not select an image" src="#" class="previewing" /></div> \
				<form id="id_cultural_institution_form"> \
				<table> \
					<tr><td><label for="id_institution_name">Name:</label></td><td><input type="text" id="id_institution_name" name="name"/></td></tr> \
					<tr><td><label for="id_address">Address:</label></td><td><input type="text" id="id_address" name="address"/></td></tr> \
					<tr><td><label for="id_description">Description:</label></td><td><input type="text" id="id_description" name="description"/></td></tr> \
					<tr>  <td><label for="id_cultural_institution_image">Cultural institution image:</label></td>  <td><input type="file" id="id_cultural_institution_image" name="image" class="id_image" accept=".gif, .jpg, .png" /></td>  </tr> \
					<tr><td colspan="2"><input type="hidden" name="type" value="'+type+'"/></td></tr> \
				</table> \
				<div align="center"><input type="button" id="id_btn_save_new_institution" class="buttons" value="Save institution"/> \
				</div> \
				<br/> \
			</form>');
		
		$('.previewing').width($('.previewing').parent().width());
		$('.previewing').height('230px');
		drawImage();
		
		$("#id_btn_save_new_institution").click(function(event) {
			event.preventDefault();
			
			addCulturalInstitutionAjax(type);
		});
		
	}
	else {
		$("#center").load("html/partials/login.html", null, loadLoginComplete);
	}
}

/*function uploadImage(urlParam) {
	var image = $(".id_image")[0].files[0];
	
	if(image) {
		$.ajax({ 
			async: false,
		    type: "POST",
			url:  urlParam,
			//contentType : "multipart/form-data",  StackOverflow: The problem is that you are setting the Content-Type by yourself,
			//                                                     let it be blank. Google Chrome will do it for you. The multipart
			//                                                     Content-Type needs to know the file boundary, and when you remove 
			//                                                     the Content-Type, Postman will do it automagically for you.
	        data : image,
			processData : false,
		    success: function() {
					toastr.success("You have successfully uploaded the image!");
		   },
			error : function(XMLHttpRequest, textStatus, errorThrown) { 
					toastr.error("Ajax ERROR: " + errorThrown + ", STATUS: " + textStatus); 
			}
		});
	}
	
}*/

function drawImage() {
	$(".id_image").change(function() {
		var file = this.files[0];
		var reader = new FileReader();
		
		if(file) {
			reader.onload = imageIsLoaded;
			reader.readAsDataURL(file);
		}
		else {
			resetImage();
		}
	});
}

function imageIsLoaded(e) {
	$(".id_image").css("color","green");
	$('.image_preview').css("display", "block");
	$('.previewing').attr('src', e.target.result);
	$('.previewing').width($('.previewing').parent().width());
	$('.previewing').height('230px');
};


function resetImage() {
	$('.previewing').attr('src', "#");
	$(".id_image").css("color","black");
}


function addCulturalInstitutionAjax(type)
{	
	$.ajax({ 
	    type: "POST",
		url:  addNewCulturalInstitutionURL,
	    data: new FormData($("#id_cultural_institution_form")[0]),
	    dataType: "json", 
	    enctype: 'multipart/form-data',
	    processData: false,
	    contentType: false,
	    cache: false,
	    success: function(success) {
	    	if(success) {
	    		$("#id_institution_name").val("");
	    		$("#id_address").val("");
	    		$("#id_description").val("");		
	    		
	    		toastr.success("You have successfully added new institution!");
	    		
	    		deleteAllExceptFirst();
    	        $("#center").append('<div><div id="search_bar"></div><div id="cultural_institutions"></div></div>');
    	        
	    		if(type == "CINEMA")
	    		{
	    	        get_data_extended('0');
	    		}
	    		else if(type == "THEATER")
	    		{
	    	        get_data_extended('1');
	    		}
	    	}
	    	else {
	    		toastr.error("Wrong data!"); 
	    	}
	   },
		error : function(XMLHttpRequest, textStatus, errorThrown) { 
					toastr.error("Ajax ERROR: " + errorThrown + ", STATUS: " + textStatus); 
		}
	});
}

function delete_institution()
{
	var button_id = this.id;
	var numb = button_id.match(/\d/g);
	numb = numb.join("");
	var ci = cultural_institutions[parseInt(numb)];

	var obj = {};
	obj["name"] = ci.name;
	obj["address"] = ci.address;	
	obj["description"] = ci.description;
	obj["type"] = ci.type;
	
	$.ajax({ 
	    type: "DELETE",
	    async: false,
		url:  deleteCulturalInstitutionURL,
	    data: JSON.stringify(obj),
	    dataType: "json", 
	    contentType: "application/json",
	    success: function(success) {
	    	if(success) {
	    		toastr.success("You have successfully deleted institution!");
	    		
	    		// refresh page
	    		deleteAllExceptFirst();
    	        $("#center").append('<div><div id="search_bar"></div><div id="cultural_institutions"></div></div>');
	    		
	    		if(ci.type == "CINEMA")
	    		{
	    	        get_data_extended('0');
	    		}
	    		else f(ci.type == "THEATER")
	    		{
	    	        get_data_extended('1');
	    		}
	    	}
	    	else {
	    		toastr.error("Wrong data!"); 
	    	}
	   },
		error : function(XMLHttpRequest, textStatus, errorThrown) { 
					toastr.error("Ajax ERROR: " + errorThrown + ", STATUS: " + textStatus); 
		}
	});
	
}

function put_data_in_html(data)
{
	var html_string = "";
	html_string += "<table id='id_cul_ins_table'><tr><th>Image</th><th>Name</th><th>Address</th><th>Description</th></tr>";
	for(x in data)
	{
		html_string += "<tr>";
		html_string += "<td>";
		html_string += "<img class='small_img' id='id_cultural_institution_img_"+x+"' alt='No image' src='#'/>";
		html_string += "</td>";
		html_string += "<td>";
		html_string +=  "<a href='/myapp/#/users/culturual_institution' id='id_cultural_institution_"+x+"'>"; 
		html_string += data[x].name;
		html_string += "</a>";
		html_string += "</td>";
		html_string += "<td>";
		html_string += data[x].address;
		html_string += "</td>";
		html_string += "<td>";
		html_string += data[x].description;
		html_string += "</td>";
		html_string += "</tr>";
		
		$("#id_cultural_institution_" + x).on("click", {name: data[x].name, address: data[x].address, description: data[x].descrption, type: data[x].type}, showCulturalInstitution);
		$("#id_cultural_institution_img_" + x).on("click", {name: data[x].name, address: data[x].address, description: data[x].descrption, type: data[x].type}, showCulturalInstitution);
		
		loadAndSetImage("cultural_institution_" + data[x].name, "id_cultural_institution_img_" + x);
	}
	html_string += "</table>"
	$("#cultural_institutions").html(html_string);
}

function put_data_in_html_extended(data)
{
	var html_string = "";
	html_string += '<table id="id_cul_ins_table"><tr> <th>Image</th ><th>Name</th><th>Address</th><th>Description</th><th><input type="button" id="id_btn_add_new_institution" class="buttons" value="Add"/><th/></tr>';
	var counter = 0;
	cultural_institutions = data;
	for(x in data)
	{
		html_string += "<tr>";
		html_string += "<td>";
		html_string += "<img class='small_img' id='id_cultural_institution_img_"+x+"' alt='No image' src='#'/>";
		html_string += "</td>";
		html_string += "<td>";
		html_string +=  "<a href='/myapp/#/users/culturual_institution' id='id_cultural_institution_"+x+"'>"; 
		html_string += data[x].name;
		html_string += "</a>";
		html_string += "</td>";
		html_string += "<td>";
		html_string += data[x].address;
		html_string += "</td>";
		html_string += "<td>";
		html_string += data[x].description;
		html_string += "</td>";
		html_string += "<td>";
		html_string += '<button id="';
		var update_button_id = 'id_btn_update_institution' + counter.toString();
		html_string += update_button_id;
		html_string += '" class="buttons_update">Update</button>';
		html_string += '<button id="';
		var delete_button_id = 'id_btn_delete_institution' + counter.toString();
		html_string += delete_button_id;
		html_string += '" class="buttons_remove">Delete</button>';
		html_string += "</td>";
		html_string += "</tr>";
		counter += 1;
		
		$("#id_cultural_institution_" + x).on("click", {name: data[x].name, address: data[x].address, description: data[x].descrption, type: data[x].type}, showCulturalInstitution);
		$("#id_cultural_institution_img_" + x).on("click", {name: data[x].name, address: data[x].address, description: data[x].descrption, type: data[x].type}, showCulturalInstitution);
		
		loadAndSetImage("cultural_institution_" + data[x].name, "id_cultural_institution_img_" + x);
	}
	html_string += "</table>";
	$("#cultural_institutions").html(html_string);
	var newCounter = 0;
	while(newCounter < counter)
	{
		var id = "id_btn_update_institution" + newCounter.toString();
		document.getElementById(id).onclick = update_institution;
		var id2 = "id_btn_delete_institution" + newCounter.toString();
		document.getElementById(id2).onclick = delete_institution;
		newCounter++;
	}
	
	$("#id_btn_add_new_institution").click(function(event) {
		event.preventDefault();
		
		addCulturalInstitution(data[0].type);
	});
	
}