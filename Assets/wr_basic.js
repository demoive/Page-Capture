/*
 * File: wr_basic.js
 *
 * Copyright (c) 2007-2009, Paulo Avila (apaulodesign.com)
 *
 * Project: General Widget Resource
 *
 * Description: Provides the necessary functions for the basic operation of
 *  most widgets.
 *
 */


/*
 * Called when the information button (ibutton) is clicked.
 * Performs the following operations:
 *
 *  - freezes the widget (so it can be changed without the user noticing)
 *  - hides the front
 *  - shows the back
 *  - flips the widget over (animation provided by system)
 *  - runs an <endHandler> if defined
 */
function wr_showBack(endHandler)
{
	// freeze the widget and prepare to show the back
	if (window.widget)
	{
		widget.prepareForTransition("ToBack");
	}

	document.getElementById("front").style.display = "none";
	document.getElementById("back").style.display = "block";

	// flip it over
	if (window.widget)
	{
		setTimeout(function () { widget.performTransition(); }, 0);
	}

	// if an end handler is passed, run it once the flip animation is done
	if (endHandler)
	{
		setTimeout(endHandler, 750);	// flip animation lasts for 750 milliseconds
	}
}


/*
 * Called when the Done button on the back is clicked.
 * Performs the following operations:
 *
 *  - freezes the widget (so it can be changed without the user noticing)
 *  - hides the back
 *  - shows the front
 *  - flips the widget over (animation provided by system)
 *  - runs an <endHandler> if defined
 */
function wr_showFront(endHandler)
{
	// freeze the widget and prepare to show the front
	if (window.widget)
	{
		widget.prepareForTransition("ToFront");
	}

	document.getElementById("back").style.display = "none";
	document.getElementById("front").style.display = "block";

	// flip it over
	if (window.widget)
	{
		setTimeout(function () { widget.performTransition(); }, 0);
	}

	// if an end handler is passed, run it once the flip animation is done
	if (endHandler)
	{
		setTimeout(endHandler, 750);	// flip animation lasts for 750 milliseconds
	}
}


/*
 * Returns the localized equivalent of <key>.
 * If a localization doesn't exist, the function simply returns what was passed to it.
 */
function wr_localize(key)
{
	try {
		key = localizedStrings[key] || key;
	}
	catch (e) { }

	return key;
}


/*
 * Returns the unique identifier assigned by the system to the specific instance of a widget.
 * If an argument is passed (such as a <keyName>), it will be appended to the identifier before the return.
 * This identifier persists between each instantiation of the Dashboard and is a READ ONLY attribute.
 */
function wr_instance()
{
	var id = (window.widget) ? widget.identifier : "!Dashboard";

	if (arguments.length === 1)
	{
		id += "-" + arguments[0];
	}
	
	return id;
}


/*
 * Formats strings so that they can be used literally through a command line interface.
 * Replaces all occurances of a single quote (') with the escaped version ('\'') and
 * encloses the entire string with single quotes:
 *
 *   Person's File Name => 'Person'\''s File Name'
 *
 * When used with the sh shell, this ensures that everything is sanitized since
 * all characters will be interpreted with their literal value.
 */
function wr_escapeCLI(cli)
{
	if (typeof(cli) === "string")
	{
		cli = cli.replace(new RegExp("\'", "g"), "'\\''");
	}

	return "'" + cli + "'";
}


/*
 * Wrapper to shorten the commonly used document.getElementById() function.
 * Returns the element with an id attribute of <id>.
 */
function wr_eId(id)
{
	return document.getElementById(id);
}


/*
 * Opens an external URL followed by GET data items.
 *
 * If arguments are specified, the first must be the URL and everything
 * else will be appended as GET data items in the following format:
 * <param0>?arg1=<param1>&arg2=<param2>&arg3=<param3>...
 *
 * If no arguments are specifed, this function opens the following URL
 * along with GET data about the widget name and version extracted from the Info.plist file
 * (NEEDS THE wr_plist.js SCRIPT):
 *
 * http://www.apaulodesign.com/widgets/index.php?s=<WIDGET_IDENTIFIER>&v=<WIDGET_VERSION>
 */
function wr_openURL()
{
	var i = 0;
	var source = "";
	var version = "";
	var url = "http://www.apaulodesign.com/widgets/index.php";
//var arguments = arguments;
	if (arguments.length === 0)
	{
		source = wr_getPlistValue("CFBundleIdentifier").wr_ext();
		version = wr_getPlistValue("CFBundleVersion");

		url += "?s=" + source + "&v=" + version;
	}
	else
	{
		url = arguments[0];

		// add any GET data that was passed as arguments
		if (arguments.length > 1)
		{
			for (i = 1; i < arguments.length; i++)
			{
//				encodeURIComponent(); maybe? ... be sure to decode___() on the other side
				url += ((i === 1) ? "?arg" : "&arg") + i + "=" + encodeURI(arguments[i]);
			}
		}
	}

	if (window.widget)
	{
		widget.openURL(url);
	}
	else
	{
		window.location.href = url;
	}	
}

/*
 * Appends the wr_ext() function to the String object.
 * Returns the text after the last period ('.') contained within a <string>.
 * If the <string> does not contain a period, simply returns the original <string>.
 */
String.prototype.wr_ext = function ()
{
	for (var i = this.length - 1; i > 0; i--)
	{
		if (this.charAt(i - 1) === ".")
		{
			break;
		}
	}

	return this.substr(i, this.length - i);
};