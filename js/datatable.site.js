var DataTable_PageLength = 10;
var DataTable_PagingType = "simple_numbers";
var DataTable_Info = true;
var DataTable_ChangeLength = true;
var DataTable_Processing = true;
var DataTable_LengthMenu = [[10, 25, 50], [10, 25, 50]];
var DataTable_Positioning = "<'col-sm-12 col-md-12'f>" +
	"<'col-12'tr>" +
	"<'container'<'row'<'col-sm-12 col-md-3'l><'col-sm-12 col-md-3'i><'col-sm-12 col-md-6'p>>>";
var DataTable_SearchLabel = "_INPUT_";
var DataTable_SearchPlaceHolder = "Search...";
var DataTable_ProcessingHTML = "<i class='fa fa-spinner fa-spin fa-3x fa-fw'></i><span class='sr-only'>Loading...</span>";

var tableCount = $('.alm-table').length;

$.extend($.fn.dataTable.defaults, {
	serverSide: true, // for process server side
	filter: true, // this is for disable filter (search box)
	orderMulti: false,
	pageLength: DataTable_PageLength,
	pagingType: DataTable_PagingType,
	info: DataTable_Info,
	lengthChange: DataTable_ChangeLength,
	processing: DataTable_Processing,
	lengthMenu: DataTable_LengthMenu,
	dom: DataTable_Positioning,
	order: [[1, "asc"]],
	language: {
		search: DataTable_SearchLabel,
		searchPlaceholder: DataTable_SearchPlaceHolder,
		processing: DataTable_ProcessingHTML
	},
	headerCallback: function (settings) {
		if (tableCount == 1)
		{
			$(".filters").insertBefore("div#dataTableGrid_filter");
			$(".filters").show();
		}
	},
	footerCallback: function (settings) {
		if (tableCount == 1) {
			$("#dataTableGrid_length").parent().removeClass().addClass('col-6 col-sm-6 col-md-6 col-lg-3');
			$("#dataTableGrid_info").parent().removeClass().addClass('col-6 col-sm-6 col-md-6 col-lg-3');
			$("#dataTableGrid_paginate").parent().removeClass().addClass('col-12 col-sm-12 col-md-12 col-lg-6');
        }
	},
	drawCallback: function (settings) {
		if (tableCount == 1) {
			if (Math.ceil((this.fnSettings().fnRecordsDisplay()) / this.fnSettings()._iDisplayLength) <= 1) {
				$('.dataTables_paginate').parent().hide();
				$('.dataTables_length').parent().hide();
				$("#dataTableGrid_info").parent().removeClass().addClass('col-6 col-sm-6 col-md-6 col-lg-6');
			}
			else {
				$('.dataTables_paginate').parent().show();
				$('.dataTables_length').parent().show();
			}
			$(".filters").insertBefore("div#dataTableGrid_filter");
			$(".dataTables_filter input[type='search']").attr("maxlength", 50);
			$(".filters").show();
			$('#dataTableGrid_wrapper div:first').addClass('d-table');
        }
    }
});

$.fn.dataTable.ext.errMode = 'none';