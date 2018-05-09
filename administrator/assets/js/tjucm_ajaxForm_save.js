/* This function carries stepped saving via ajax */
function steppedFormSave(form_id, status)
{
	var item_basic_form = jQuery('#' + form_id);
	var promise = false;
	jQuery('#form_status').val(status);

	if ('save' == status) {

		if(confirm(Joomla.JText._('COM_TJUCM_ITEMFORM_ALERT')) == true)
		{
			/* code to remove the class added by are-you-sure alert box */
			jQuery('#item-form').removeClass('dirty');

			if (!document.formvalidator.isValid('#item-form'))
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}

	if(item_basic_form)
	{
		jQuery(item_basic_form).ajaxSubmit({
			datatype:'JSON',
			success: function(data) {
				var returnedData = JSON.parse(data);
				if(returnedData.data != null)
				{
					if ('save' == status) {
						jQuery("#finalSave").attr("disabled", "disabled");
						var url= window.location.href.split('#')[0],
						separator = (url.indexOf("?")===-1)?"?":"&",
						newParam=separator + "id=" + returnedData.data + "&success=1";
						newUrl=url.replace(newParam,"");
						newUrl+=newParam;
						window.location.href =newUrl;

						/*opener.location.reload();
						window.close();*/
					}
					else
					{
						jQuery("#recordId").val(returnedData.data);
						promise = true;
					}
				}
				else
				{
					if(returnedData.message)
					{
						Joomla.renderMessages({'error':returnedData.message});
					}

					if(returnedData.messages.warning)
					{
						Joomla.renderMessages({'error': returnedData.messages.warning});
					}

					if(returnedData.messages.error)
					{
					Joomla.renderMessages({'error': returnedData.messages.error});
					}
				}

			}
		});
	}

	return promise;
}

/*Function triggered by clicking on the "Save and next"*/
function itemformactions(tab_id, navDirection)
{
	var getTabId = tab_id + "Tabs";

	var currentTabName = jQuery('ul#' + getTabId).find('li.active a').attr('href');
	var nextTabName = jQuery('ul#' + getTabId).find('li.active').next('li').children('a').attr('href');
	var prevTabName = jQuery('ul#' + getTabId).find('li.active').prev('li').children('a').attr('href');

	/* Once all fields are validated, enable Final Save*/
	steppedFormSave('item-form');

	if (navDirection == "next")
	{
		jQuery('#' + getTabId + ' > .active').next('li').find('a').trigger('click');
	}
	if (navDirection == "prev")
	{
		jQuery('#' + getTabId + ' > .active').prev('li').find('a').trigger('click');
	}
}

/* This function deletes tjucm file via ajax */
function deleteFile(filePath, fieldId)
{
	if (!filePath)
	{
		return;
	}

	if(!confirm(Joomla.JText._('COM_TJUCM_FILE_DELETE_CONFIRM')))
	{
		return;
	}

	jQuery.ajax({
		url: Joomla.getOptions('system.paths').root + "/index.php?option=com_tjucm&task=itemform.deleteFile&format=json",
		type: 'POST',
		data:{
				filePath: filePath
		},
		cache: false,
		dataType: "json",
		success: function (result) {
			alert(result.message);
			if (result.data) {
				var element = jQuery("input[fileFieldId='" + fieldId + "']");
				element.val('');
				element.next().remove('div.control-group');
			}
		}
	});
}
