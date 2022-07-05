
var inputMaskFormat = "mm/dd/yyyy";
var datePickerFormat = "mm/dd/yy";

var toasterOptions = {
	closeButton: true,
	progressBar: true,
	showDuration: 600,
	preventDuplicates: true,
	preventOpenDuplicates: true
};

var ckEditorToolbarConfiguration = ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', "insertTable", "tableColumn", "tableRow", "mergeTableCells"];

$(function () {

	$("input:text,form").attr("autocomplete", "off");

	//set tab on refresh
	var hash = window.location.hash;
	hash && $('ul.nav a[href="' + hash + '"]').tab('show');

	$('.nav-tabs a').click(function (e) {
		$(this).tab('show');
		var scrollmem = $('body').scrollTop() || $('html').scrollTop();
		window.location.hash = this.hash;
		$('html,body').scrollTop(scrollmem);
	});

	$(".mImage").on("click", function () {

		var modal = document.getElementById("imgModal");
		var modalImg = document.getElementById("imgModalContent");
		var captionText = document.getElementById("imgModalCaption");

		modal.style.display = "block";
		modalImg.src = this.src;
		captionText.innerHTML = this.alt;

		// Get the <span> element that closes the modal
		var span = document.getElementById("modelCloseBtn");

		// When the user clicks on <span> (x), close the modal
		span.onclick = function () {
			modal.style.display = "none";
		}

	});
});


function RemoveExistingTabContent() {
	$(".tab-pane").html("");
}

function FormatDate(dt)
{
	if (dt != null && dt != "" )
		return moment(dt).format('MM/DD/YYYY');
	else
		return "";
}

function InitializeElements() {

	$(".decimal-input-mask").inputmask(
		{
			alias: "decimal",
			max: 999999,
			allowMinus: false,
			rightAlign: true,
			placeholder: "",
			digits: 2
		});

	$(".integer-input-mask").inputmask(
		{
			alias: "integer",
			max: 999999,
			allowMinus: false,
			rightAlign: true,
			placeholder: ""
		});


	$(".phoneInputMask").inputmask("(999) 999-9999"); //phone input mask
	$(".SSNInputMask").inputmask("999-99-9999"); // SSN input mask
	$(".datepicker").inputmask("99/99/9999");

	if ($(".datepicker.pastDate").length > 0)
	{
		$(".datepicker.pastDate").datepicker(
			{
				changeMonth: true,
				changeYear: true,
				//dateFormat: "m/dd/yy",
				dateFormat: datePickerFormat,
				yearRange: "-120:+0",
				maxDate: 0
			});
	}

	if ($(".datepicker.futureDate").length > 0)
	{
		$(".datepicker.futureDate").datepicker(
			{
				changeMonth: true,
				changeYear: true,
				//dateFormat: "m/dd/yy",
				dateFormat: datePickerFormat,
				yearRange: "0:+30",
				minDate: 0
			});
    }

	if ($(".datepicker").length > 0)
	{
		$(".datepicker").datepicker(
			{
				changeMonth: true,
				changeYear: true,
				//dateFormat: "m/dd/yy"
				dateFormat: datePickerFormat
			});
	}
	

	$("form").keypress(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	})

	$('form').submit(function () {
		if ($(this).valid()) {
			$(this).find(':input[type=submit]').prop('disabled', true);
		}
	});

	$(".input-currency").each(function (index, element) {
		formatCurrencyInput($(element));
	});

}

/*Mobile menu open and close*/
$("span.menu_hamburger").click(function () {
	$("nav > ul").toggleClass("open-menu");
});
$("nav ul li > a").click(function () {
	$(this).next("ul").slideToggle();
	$(this).parent("li").toggleClass("opened");
});

/*Header settings open and close*/
$("ul.header_setting li em").click(function () {
	$(this).next("ul").slideToggle();
});
/*Header user settings open and close*/
$("ul.header_setting li span").click(function () {
	$(this).next("ul").slideToggle();
});

/*Profile edit open and close*/
$("button.profile_edit").click(function () {
	$("ul.profile_edit_list").slideToggle();
});

/*UCL list open and close*/
$("ul.ucl-secondary-list li a").click(function () {
	$(this).next("ul").slideToggle();
	$(this).parent("li").toggleClass("active");
});

$("#ucl-data .ucl_hamburger").click(function () {
	$("#ucl-data .aside_data").slideToggle();
});

/*Password show and hide open and close*/
$(".toggle-password").click(function () {
	$(this).toggleClass("fa-eye fa-eye-slash");
	var input = $($(this).attr("toggle"));
	if (input.attr("type") == "password") {
		input.attr("placeholder", "490-00-1234");
	} else {
		input.attr("placeholder", "490-xx-xxxx");
	}
	if (input.attr("type") == "password") {
		input.attr("type", "text");
	} else {
		input.attr("type", "password");
	}

});

var settings = {
	validClass: "is-valid",
	errorClass: "is-invalid",
	errorPlacement: function (error, element)
	{
		if (error.length > 0) {
			ErrorPopup(error[0].innerHTML);
		}
	},
	onfocusout: false,
	onkeyup: false,
	onclick: false
};
$.validator.setDefaults(settings);
$.validator.unobtrusive.options = settings;

$(document).ajaxError(function (event, jqxhr, setngs, thrownError) {
	if (jqxhr.status === 401) {
		ErrorPopup("Session has expired. Please login again.");
		document.location.href = '/Account/Login';
	}
	else if(jqxhr.status === 403) {
		document.location.href = '/Home/AccessDenied';
	}
	else {

		ErrorPopup("Error occurred");
	}
});

function RenderPartial(url, renderDiv) {
	$.ajax({
		method: 'GET',
		url: url,
		success: function (data) {
			$(renderDiv).html(data);
		}
	});
}

function SetValue(url, renderElement) {
	$.ajax({
		method: 'GET',
		url: url,
		success: function (data) {
			$(renderElement).val(data);
		}
	});
}

function RenderFormPartial(url, renderDiv, formId) {
	$.ajax({
		method: 'GET',
		url: url,
		success: function (data) {
			$(renderDiv).html(data);
			var form = $($(formId))
				.removeData("validator")
				.removeData("unobtrusiveValidation");

			$.validator.unobtrusive.parse(form);
		}
	});
}

function RenderModal(url, ModalId, renderDiv, formId) {

	$.ajax({
		method: 'GET',
		url: url,
		success: function (data) {

			$(renderDiv).html(data);

			$(ModalId).modal('show');

			if (RenderModal != "") {
				var form = $($(formId))
					.removeData("validator")
					.removeData("unobtrusiveValidation");

				$.validator.unobtrusive.parse(form);
            }

		}
	});
}

function CloseAllModals() {
	$('.modal').modal('toggle');
}

function ErrorPopup(msg) {
	if (msg != null && msg != "")
		if (!hasSameErrorToastr(msg)) {
			toastr.error(msg, "Error", toasterOptions);
		}
}

function SuccessPopup(msg) {
	if (msg != null && msg != "")
		if (!hasSameErrorToastr(msg)) {
			toastr.success(msg, "Success", toasterOptions);
		}
}

function hasSameErrorToastr(message) {

	var hasSameErrorToastrBool = false;

	var $toastContainer = $('#toast-container');
	if ($toastContainer.length > 0) {
		var $errorToastr = $toastContainer.find('.toast-error');
		if ($errorToastr.length > 0) {
			var currentText = $errorToastr.find('.toast-message:contains("' + message + '")').text();
			var areEqual = message.toUpperCase() === currentText.toUpperCase();
			if (areEqual) {
				hasSameErrorToastrBool = true;
			}
		}
	}

	return hasSameErrorToastrBool;
}


function CalculateAge(dob) {
	if (dob === '' || dob == null) {
		return 0;
	}
	else {
		return Math.floor((Date.now() - Date.parse(dob)) / 31536000000);
	}
}

var hidWidth;
var scrollBarWidths = 40;

var widthOfList = function () {
	var itemsWidth = 0;
	$('.list li').each(function () {
		var itemWidth = $(this).outerWidth();
		itemsWidth += itemWidth;
	});
	return itemsWidth;
};

var widthOfHidden = function () {
	return (($('.wrapper').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
};

var getLeftPosi = function () {
	if ($('.list').length)
		return $('.list').position().left;
	else
		return 0;
};

var reAdjust = function () {
	if (($('.wrapper').outerWidth()) < widthOfList()) {
		$('.scroller-right').show();
	}
	else {
		$('.scroller-right').hide();
	}

	if (getLeftPosi() < 0) {
		$('.scroller-left').show();
	}
	else {
		$('.item').animate({ left: "-=" + getLeftPosi() + "px" }, 'slow');
		$('.scroller-left').hide();
	}
}

reAdjust();

$(window).on('resize', function (e) {
	reAdjust();
});

$('.scroller-right').click(function () {

	$('.scroller-left').fadeIn('slow');
	$('.scroller-right').fadeOut('slow');

	$('.list').animate({ left: "+=" + widthOfHidden() + "px" }, 'slow');
});

$('.scroller-left').click(function () {

	$('.scroller-right').fadeIn('slow');
	$('.scroller-left').fadeOut('slow');

	$('.list').animate({ left: "-=" + getLeftPosi() + "px" }, 'slow');
});

function genCharArray(charA, charZ) {
	var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
	for (; i <= j; ++i) {
		a.push(String.fromCharCode(i));
	}
	return a;
}
function DestroyDatatable(id) {
	$(".filters").hide();
	$(".filters").insertAfter("#AlphabetFilterDiv");
	$(".filters").insertAfter(".AlphabetFilterDivClass");
	$(id).DataTable().clear();
	$(id).DataTable().destroy();
}
function RenderAlphabetsContainer(func) {
	var alphabetsArray = genCharArray('A', 'Z');

	$('.alphabetFilter').append('<a id="All" class="active" href="' + func + ')" >All</a> &nbsp;&nbsp;&nbsp;')

	for (var i = 0; i < alphabetsArray.length; i++) {
		var funcName = func + "'" + alphabetsArray[i] + "')";
		$('.alphabetFilter').append('<a id="' + alphabetsArray[i] + '" href="' + funcName + '" >' + alphabetsArray[i] + '</a> &nbsp;&nbsp;&nbsp;')
	}
}
function ToggleAlphabeticFilter(id) {

	$(id).slideToggle();
}

function SetUclMenuItemAsActive(catId) {

	$(".liSubCategory").removeClass("active");

	$("#" + catId.replace(/(:|\.|\[|\]|,|=|@@)/g, "\\$1")).parent().addClass("active");

	$(".liCategory").removeClass("active");

	$("#" + catId.replace(/(:|\.|\[|\]|,|=|@@)/g, "\\$1")).parent().parent().parent().addClass("active");
	$(".ucl-secondary-list li.liCategory").not(".active").find("ul").slideUp();
	$("#" + catId.replace(/(:|\.|\[|\]|,|=|@@)/g, "\\$1")).parent().parent().slideDown();
}

$(".left_col aside em.fas").click(function () {
	$(".profile_img").toggleClass("s-profile_img");
	$("#alm-data .left_col").toggleClass("collapse-left");
	$("#content").toggleClass("expand-content");
	if ($('#alm-data .left_col.collapse-left').length > 0) {
		SetStorageValue("IsLeftMenuCollapsed", "true");
		UpdateExpandCollapseSessionValue(true);
	}
	else {
		SetStorageValue("IsLeftMenuCollapsed", "false");
		UpdateExpandCollapseSessionValue(false);
    }
});

function UpdateExpandCollapseSessionValue(newValue) {
	$.ajax({
		url: "/Base/" + newValue + "/UpdateCollapseExpandLeftMenu",
		type: "GET",
		dataType: "json"
	});
}

function SetStorageValue(key, val) {
	localStorage.setItem(key, val);
}

function GetStorageValue(key) {
	localStorage.getItem(key);
}

function ShowActiveInActiveIcon(td, cellData) {

	if (cellData)
		$(td).addClass("table-true");
	else
		$(td).addClass("table-false");
}

function formatNumber(n) {
	// format number 1000000 to 1,234,567
	//return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	return n.toLocaleString();
}

function isNumeric(num) {
	return !isNaN(num)
}

function formatCurrencyInput(input) {
	// appends $ to value, validates decimal side
	// and puts cursor back in right position.

	// get input value
	var input_val = input.val();


	// don't validate empty input
	if (input_val === "") { return; }

	// original length
	var original_len = input_val.length;

	// initial caret position 
	var caret_pos = input[0].selectionStart;

	input_val = FormatCurrency(input_val);

	// send updated string to input
	input.val(input_val);

	// put caret back in the right position
	var updated_len = input_val.length;
	caret_pos = updated_len - original_len + caret_pos;
	input[0].setSelectionRange(caret_pos, caret_pos);
}

function FormatCurrency(val) {

	if ((val != null && val != "") || isNumeric(val))
	{
		var input_val = val.toString();

		// check for decimal
		if (input_val.indexOf(".") >= 0) {

			// get position of first decimal
			// this prevents multiple decimals from
			// being entered
			var decimal_pos = input_val.indexOf(".");

			// split number by decimal point
			var left_side = input_val.substring(0, decimal_pos);
			var right_side = input_val.substring(decimal_pos);

			if (right_side.length == 2)
			{
				right_side = right_side + "0";
			}
			// add commas to left side of number
			left_side = formatNumber(left_side);

			// validate right side
			//right_side = formatNumber(right_side);

			// On blur make sure 2 numbers after decimal
			//if (blur === "blur") {
			//	right_side += "00";
			//}

			// Limit decimal to only 2 digits
			right_side = right_side.substring(0, 3);

			// join number by .
			input_val = left_side + right_side;

		} else {
			// no decimal entered
			// add commas to number
			// remove all non-digits
			input_val = formatNumber(input_val);

			// final formatting
			input_val += ".00";
		}
		return input_val;
	}	
}

function isUrlValid(url) {
	return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

function getWords(str, noOfWords) {

	var wordsArr = str.split(/\s+/).slice(0, noOfWords);

	var nstring = "";

	if (wordsArr.length < noOfWords) {
		nstring = str;
	}
	else {
		nstring = str.split(/\s+/).slice(0, noOfWords).join(" ") + "...";
	}

	if (nstring.length > 120) {
		nstring = nstring.substring(0, 120) + "...";
    }
	return nstring;
}


$('input[type="file"]').change(function (e) {
	var fileName = e.target.files[0].name;
	$('.custom-file-label').html(fileName);
});

$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

	window.location = this.href;
	
});
