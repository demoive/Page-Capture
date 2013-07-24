/*
 * File: main.js
 *
 * Copyright (c) 2010, Paulo Avila (apaulodesign.com)
 *
 * Project: Page Capture Widget
 * Author: Paulo Avila
 *
 * Description: Main function declarations for the operation
 *  of the Page Capture widget (webpage to bitmap capturing).
 *
 * Modification Log:
 *  2009.04.07	Paulo	- Created images (icon, front, back, etc.)
 *  2009.04.19	Paulo	- Redesigned widget (icon, front, back, etc.)
 *  2009.04.20	Paulo	- Added HTML elements (form & i button on front; logo, form & done button on back)
 *	                 	- Width preference value gets verified and saved before transition to front
 *	                 	- Positioned the widget close X correctly
 *	                 	- Validate and try to fix improper URIs before saving them and executing command
 *	                 	- Spinner animation & disabled fields during operation
 *	                 	- Scales the image by percentage from a drop-down menu (rather than a fixed pixel value)
 *  2009.04.21	Paulo	- Customized output messages in webkit2png script
 *	                 	- Properly flush the output buffers so that messages appear automatically on widget
 *	                 	- v1.0 (internal release)
 *  2009.04.22	Paulo	- Updated icon (minor changes to the shadows of the aperture blades for more realism)
 *	                 	- Updated Safari icon on front of widget (slightly larger aperture and better shadows)
 *	                 	- Escapes URIs for proper formatting (no longer sees multiple URLs since spaces are converted)
 *	                 	- Form blurred when focus is taken away from the widget
 *	                 	- Operation can be cancelled by clicking on an active spinner
 *	                 	- Created status icons to be displayed for informative messages
 *	                 	- Default (and minimum) width now 1024px instead of webkit2png's default 800px
 *  2009.04.23	Paulo	- Check for new versions by clicking on the version on the back
 *	                 	- Saved preferences are restored/applied on load
 *	                 	- Page Capture icon can be clicked to start operation
 *	                 	- Handles empty strings properly (by not commencing the operation)
 *  2009.04.25	Paulo	- If the python cmd exits with an error, a more appropriate message is displayed
 *	                 	- Changed how files are named (removes any characters that are not: ___________)
 *	                 	- Fixed a bug to no longer escape the percent sign (%) since it exists in pre-escaped URIs
 *	                 	- Reformatted how files are named (<domain> > <file>.png)
 *	                 	- Reformatted how files are named (full URL)
 *	                 	- Files named with a prefix of "Page Capture " + incremental # (follows the screenshot convention on the Mac)
 *	                 	- v1.1
 *  2010.11.12	Paulo	- Adding support for delay...
 *
 * Known Issues:
 *	- If URL already has escaped characters, encodeURI() will encode them again (possible fix: don't use encodeURI()...maybe just replace spaces with %20 since that is the most common).
 *
 * Pending Visual Modifications:
 *	- Focusing on URI field highlights the contents
 *	- Messages fade out after ~5 seconds
 *	- Success message includes filename
 *	- URI form field now has it's own background image (with a glow during focus)
 *	- Focusing on widget automatically focuses on URI form field
 *	- Add shake animation if the value of the width is invalid
 *
 * Pending Functional Modifications:
 *	- Clicking on filename (in result message) opens file if it still exists with same name
 *	- Date in filename?
 *	+ Use web page's title as the file name
 *	- Multiple URLs (delimited by commas + whitespace) now accepted
 *	- Save a history of (up to 10) URIs
 *	- Validate width value again before running command?
 *	- Save image to different format types (tiff, gif, jpg, etc)
 *	- Configurable "save to" location (Maybe hard-coded: Downloads, Pictures, etc.)?
 *	- Allow for local files (file://) to be rendered as well
 *	- Higher resolution of page captured?
 *	- Allow right clicking?
 *
 * Suggestions:
 *	- Scheduler to take Page Captures on an interval and save a history of the images (Andrew Hellner)
 */

var g_cmd = null;
var g_spinner = null;


function w_init()
{
	w_registerHandlers();
	w_loadSavedPrefs();
}

/*
 * Transitions the widget to the front after checking that the
 * width value is valid (blank or an integer).
 */
/*
function w_toFront()
{

	var width = wr_eId("width").value;

	// only digits allowed (or a blank field)
	if (/^\d*\n?$/.test(width))
	{
		// save width value (if blank, clear the saved preference)
		wr_setPref(((width !== "") ? width : null), wr_instance("width"));

		wr_showFront();
	}
	else
	{
		// shake to indicate invalid value
	//	w_shake(wr_eId("options"));
	}
}
*/


/*
 * 
 */
function w_doCapture()
{
	var command = "";
	var uri = wr_eId("uri").value;

	if (uri === "") { return; }

	command = "/usr/bin/python ~/Library/Widgets/Page\\ Capture.wdgt/Assets/webkit2png-0.5.sh";
	command += " --width=1024";
	command += " --dir=~/Desktop/";
	command += " --delay=" + wr_eId("delay").value;
	command += " --thumb";
	command += " --scale=" + wr_eId("width").value;

/*
	if (wr_eId("width").value !== "")
	{
		command += " --width=" + wr_eId("width").value;
	}
*/

	// ensure the URI has proper prefix (allows for 'http' and 'https') and encoding
	uri = encodeURI((uri.indexOf("http://") === 0 || uri.indexOf("https://") === 0) ? uri : "http://" + uri);
	uri = uri.replace(/%25/, "%");

	// save updated URI into preferences
	wr_setPref(uri, wr_instance("uri"));

	// update visual URI
	wr_eId("uri").value = uri;

	command += " " + wr_escapeCLI(uri);

	// disable fields
	wr_eId("uri").disabled = true;
	wr_eId("start").onclick = null;
	wr_eId("width").disabled = true;

	wr_eId("infoText").innerHTML = "Page Capture engine loading...";

	// start spinner
	wr_eId("infoImage").style.backgroundPositionY = "0";
	g_spinner = setInterval(function () { w_shiftSpinner(); }, 75);
	wr_eId("infoImage").style.appleDashboardRegion = "dashboard-region(control circle)";

	if (window.widget)
	{
		g_cmd = widget.system(command, w_finishCapture);
		g_cmd.onreadoutput = w_outputHandler;
	}

	//alert(command);
}


function w_cancelCapture()
{
	if (g_cmd)
	{
		g_cmd.cancel();

		clearInterval(g_spinner);
		wr_eId("infoImage").style.appleDashboardRegion = "";
		wr_eId("infoImage").style.backgroundPositionY = "-" + (13 * 15) + "px";
		wr_eId("infoText").innerHTML = "Cancelled.";
	}

	// re-enable fields
	wr_eId("uri").disabled = false;
	wr_eId("start").onclick = w_doCapture;
	wr_eId("width").disabled = false;

	g_cmd = null;
}


function w_finishCapture()
{
	// hault and remove the spinner
	clearInterval(g_spinner);
	//wr_eId("infoImage").style.backgroundPositionY = "0";
	wr_eId("infoImage").style.appleDashboardRegion = "";

	wr_eId("infoImage").style.backgroundPositionY = "-" + (/^<filename>Page Capture \d+<\/filename> saved to your Desktop\.\n$/.test(wr_eId("infoText").innerHTML) ? (14 * 15) : (13 * 15)) + "px";

	// if the python engine exited with an error
	if (g_cmd.status !== 0)
	{
		wr_eId("infoText").innerHTML = "Error detected.";
	}

	// re-enable fields
	wr_eId("uri").disabled = false;
	wr_eId("start").onclick = w_doCapture;
	wr_eId("width").disabled = false;

	g_cmd = null;
}


function w_outputHandler(stdout)
{
	wr_eId("infoText").innerHTML = stdout;
}


function w_shiftSpinner()
{
	var offset = -15;
	var current = parseInt(document.defaultView.getComputedStyle(wr_eId("infoImage"), null).getPropertyValue('background-position-y'), 10);
	var slide = current / offset;

	// loops the matrix of images
	wr_eId("infoImage").style.backgroundPositionY = ((slide === 12) ? offset : (current + offset)) + "px";
}


function w_versionCheck()
{
	var responses;

	var AJAX_STATE_UNSENT = 0;
	var AJAX_STATE_OPEN = 1;
	var AJAX_STATE_HEADERS_RECEIVED = 2;
	var AJAX_STATE_LOADING = 3;
	var AJAX_STATE_DONE = 4;

	var RESPONSE_CODE_OK = 200;
	var RESPONSE_CODE_NOT_FOUND = 404;

	var url = "http://www.apaulodesign.com/widgets/version.php?s=" + wr_getPlistValue("CFBundleIdentifier").wr_ext();

	var g_ajaxRequest = new XMLHttpRequest();

	wr_eId("version").onclick = null;
	wr_eId("version").innerHTML = "&thinsp;.&thinsp;.&thinsp;.";

	g_ajaxRequest.open("GET", url);
	g_ajaxRequest.setRequestHeader("Cache-Control", "no-cache");
	g_ajaxRequest.onreadystatechange = function () {

		if (g_ajaxRequest.readyState == AJAX_STATE_DONE)
		{
			if (g_ajaxRequest.status == RESPONSE_CODE_OK)
			{
				if (g_ajaxRequest.responseText !== null && g_ajaxRequest.responseText !== '')
				{
					responses = g_ajaxRequest.responseText.split("|", 1);

					// new version available
					if (wr_getPlistValue("CFBundleVersion") !== responses[0])
					{
						wr_eId("version").innerHTML = "Get";
						//wr_eId("version").style.backgroundImage = "url(Images/arrow.png)";
						wr_eId("version").className = "link";
						wr_eId("version").onclick = function () { wr_openURL(); };
					}
					else
					{
						// restore click functionality & text
						wr_eId("version").onclick = w_versionCheck;
						wr_eId("version").className = "idle";
						wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion");
					}
				}
				else
				{
					// empty page received
				}
			}
			/*
			else if (g_ajaxRequest.status == AJAX_STATE_UNSENT)
			{
				alert("check ur internet connection or try again later");
			}
			else
			{
				//wr_dialog with option to send developer and note
				alert("my site might be down temporarily (RESPONSE_CODE_NOT_FOUND) (404)"); 			}
			*/
		}
		/*
		else if (g_ajaxRequest.readyState == AJAX_STATE_LOADING)
		{
			//warning message if a reasonable timeout is reached
			//allow for abort with the use of request g_ajaxRequest.abort();
		}
		*/
	};

	g_ajaxRequest.send(null);		// sends the request
}


/*
 * Retrieves any previously saved settings and applies
 * their values to the correct elements.
 */
function w_loadSavedPrefs()
{
	var uri = wr_getPref(wr_instance("uri"));
	var width = wr_getPref(wr_instance("width"));

	if (uri) { wr_eId("uri").value = uri; }
	if (width) { wr_eId("width").value = width; }
}


function w_registerHandlers()
{
	// quit if this function has already been called else
	// flag this function so we don't do the same thing twice
	if (arguments.callee.done) { return; }
	else { arguments.callee.done = true; }

	//function () { wr_showBack(function () { wr_eId("width").focus(); }); }
	var infoButton = new AppleInfoButton(wr_eId("infoButton"), wr_eId("front"), "white", "black", wr_showBack);
	var doneButton = new AppleGlassButton(wr_eId("doneButton"), wr_localize("Done"), function () {
		wr_eId("version").onclick = w_versionCheck;
		wr_eId("version").className = "idle";
		wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion");
		wr_showFront();
	});

	//setTimeout(function () { wr_eId("uri").blur(); }, 25);
	wr_eId("uri").onkeypress = function () { if (event.keyCode === 3 || event.keyCode === 13) { w_doCapture(); } };

	wr_eId("start").onclick = w_doCapture;

	wr_eId("infoImage").onmouseover = function () { wr_eId("infoImage").className = "mouseover"; };
	wr_eId("infoImage").onmouseout = function () { wr_eId("infoImage").className = "mouseout"; };
	wr_eId("infoImage").onclick = function () { if (wr_eId("uri").disabled) { w_cancelCapture(); } };

	//wr_eId("width").onfocus = function () { alert("focussed") };
	//wr_eId("width").onblur = function () { alert("blurred!") };
//	wr_eId("width").onkeypress = function () { if (event.keyCode === 3 || event.keyCode === 13) { w_toFront(); } };
	wr_eId("width").onchange = function () { wr_setPref(wr_eId("width").value, wr_instance("width")); };

	wr_eId("logo").onclick = function () { wr_openURL(); };
	wr_eId("version").innerHTML = "v" + wr_getPlistValue("CFBundleVersion");
	wr_eId("version").onclick = w_versionCheck;

//	window.onfocus = function () {
//		wr_eId("uri").focus();
//	};

	window.onblur = function () {
		wr_eId("uri").blur();
	};

	// widget-specific handlers
	if (window.widget)
	{
		// Called when the Dashboard environment is activated
		widget.onshow = function () {
			// if still running, resume spinner animation
			if (wr_eId("uri").disabled)
			{
				g_spinner = setInterval(function () { w_shiftSpinner(); }, 75);
			}
		};

		// Called when the Dashboard environment is exited
		widget.onhide = function () {
			// pause spinner animation
			clearInterval(g_spinner);
		};

		// Called when the Widget instance is closed (not refreshed).
		widget.onremove = function () {
			w_cancelCapture();

			// clear widget-specific saved preferences
			wr_setPref(null, wr_instance("width"));
			wr_setPref(null, wr_instance("uri"));
		};
	}
}
