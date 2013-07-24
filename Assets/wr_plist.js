/*
 * File: wr_plist.js
 *
 * Copyright (c) 2007-2009, Paulo Avila (apaulodesign.com)
 *
 * Project: General Widget Resource
 *
 * Description: Provides methods to read and write widget preferences and
 *  read only access to the values of keys defined inside the Info.plist file.
 *  Also provides the Constructor for building preference Objects.
 *
 */

var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var CDATA_SECTION_NODE = 4;
var ENTITY_REFERENCE_NODE = 5;
var ENTITY_NODE = 6;
var PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = 11;
var NOTATION_NODE = 12;


/*
 * Returns a previously saved preference with key <keyName>
 * or null if the <keyName> doesn't exist.
 */
function wr_getPref(keyName)
{
	var keyValue = null;

	if (window.widget)
	{
		keyValue = widget.preferenceForKey(keyName);
	}

	return keyValue;
}


/*
 * Saves a value (<keyValue>) to a corresponding key (<keyName>).
 * Returns the <keyName> that the <keyValue> was saved under.
 */
function wr_setPref(keyValue, keyName)
{
	if (window.widget)
	{
		widget.setPreferenceForKey(keyValue, keyName);
	}

	return keyName;
}


/* 
 * Returns the value of the <key> contained in the Info.plist file
 * by the use of AJAX and XML parsing.
 *
 * If the value is an array, it will return a comma-delimeted
 * string containing all the values of the array.
 *
 * Note that the Info.plist file must exist in the same directory as
 * the HTML file that calls this function. Ideally this location is
 * the root of the widget.
 */
function wr_getPlistValue(key)
{
	var i, j;
	var keyValue = "";			// the value that will be returned

	var nodes = null;			// will contain all the nodes of the Info.plist file
	var arrayNodes = null;		// only used if the target <key> is an array of values

	var ajaxRequest = new XMLHttpRequest();

	// synchronous ajax request to get the contents of the Info.plist file
//JSLing: Unescaped '/'.
	ajaxRequest.open("GET", window.location.pathname.replace(/[^/]*$/, "Info.plist"), false);
	ajaxRequest.send(null);

	nodes = ajaxRequest.responseXML.getElementsByTagName("dict")[0].childNodes;

	// traverse the file until the requested key has been found
	for (i = 0; i < nodes.length; i++)
	{
		if (nodes[i].nodeType === ELEMENT_NODE &&
			nodes[i].tagName.toLowerCase() === "key" &&
			nodes[i].firstChild.data === key)
		{
			if (nodes[i + 2].tagName.toLowerCase() !== "array")
			{
				keyValue = nodes[i + 2].firstChild.data;
			}
			else
			{
//JSLint: Use the array literal notation [].
				keyValue = new Array();
				arrayNodes = nodes[i + 2].childNodes;

				for (j = 0; j < arrayNodes.length; j++)
				{
					if (arrayNodes[j].nodeType === ELEMENT_NODE)
					{
						keyValue.push(arrayNodes[j].firstChild.data);
					}
				}
			}

			break;
		}
	}

	return keyValue;
}
