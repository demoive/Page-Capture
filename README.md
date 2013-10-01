# Page Capture

Mac OS X Dashboard Widget to capture a full screenshot of a webpage.

This project is not actively maintained anymore. For that reason, I've made it open source. It is still available for download:
http://www.apple.com/downloads/dashboard/developer/pagecapture.html


## Summary

The Page Capture widget is the easiest and fastest way to take a screenshot of web pages. No matter how long a page may be, the Page Capture widget will capture the entire page and save it to an image. Say “Good Bye!” to puzzling together multiple screenshots manually and let the Page Capture widget do all the work for you!


## Features

- Captures entire web pages no matter how far they scroll.
- Easy to use: type or paste a URL — hit Return or click the logo.
- Uses Safari’s powerful and fast WebKit rendering engine.
- Check for new versions by clicking the version displayed on the back.
- Automatically resize the image (default is 50%).
- Free!


## FAQ

### Why does a page I load in my browser look different than the Page Capture produced by the widget?

Different browsers use different rendering engines to interpret and display web pages. The Page Capture widget uses the same rendering engine as Safari ([WebKit](http://www.webkit.org/)), so if you normally use Firefox, Camino, Opera or some other browser the page might look a little bit different.

If you use Safari and a page _still_ looks different in the browser when compared to the image produced by the Page Capture widget, the difference is most likely due to cookies that your browser has saved from previous sessions to that same page. The Page Capture widget fetches the URL clean connection and it is not influenced by settings that your browser may have saved.

### Why does it seem to take longer to “fetch” a URL in the Page Capture widget than in my browser?

Your browser normally caches the contents of pages that you visit (including images, scripts, etc.). So after the first time you visit a page in Safari, for example, a lot of its content already exists on your computer. When you visit that page again, it will load faster since a lot of the content already exists on your computer. The Page Capture widget isn't influenced by this cached content.

If you have doubts, try clearing your browser’s cache or reloading a page while holding the `Shift` key and it should take about the same time in your browser as it’s taking in the Page Capture widget. Remember to allow a little bit of extra time for the image processing that the widget has to do :)


## Release notes

- **Version 1.1** — _April 25, 2009_
  - Operation can be canceled by clicking the spinner
  - Check for new versions by clicking on the version displayed on the back
  - Multiple instances allowed (each with their saved preferences restored
  - Files named with same convention as Mac OS X’s screenshot utility
  - Improvements to how URIs are handled
  - Default minimum width changed to 1024 pixels
  - Minor updates to the icon

- **Version 1.0** — _April 23, 2009 (internal release)_
  - Ability to scale image by a percentage
  - Spinner animation while working
  - Fields disabled during an operation
  - Descriptive output messages appear during operation
