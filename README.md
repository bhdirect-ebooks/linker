# Linker
_A handy way to create many links across multiple HTML files_

Usage:
1. Create a tab-delimited text file in the following format:
```regexp
file-to-link-from\ttext to link from\tfile-to-link-to\t<html>to link to\n
```
   example:
```text
POSBActSpa02_chapter02.xhtml	I. Los grandes días de expectación	POSBActSpa02_chapter03.xhtml	<h1><span class="label">División I</span>Los Grandes Días de Expectación
```
    
2. Save the file in your EPUBs 'META-INF' folder in UTF-8 format with Unix line breaks (`\n`)
3. Install _Linker_ globally after cloning the repo by entering `npm install -g` from within the linker directory
4. Navigate in a terminal to your EPUB directory
5. Run `linker file.txt 1` where 'file.txt' is the file you created in META-INF and '1' is the number you want to start with for incrementing ids

Behavior:
* Linker will surround the __first__ occurrence of 'text to link from' in 'file-to-link-from' with an `<a>` tag whose href is file-to-link-to with a unique id: `#ref[num]`
    e.g. `<a href="POSBActSpa02_chapter03.xhtml#ref1">I. Los grandes días de expectación</a>`
    This could give you less than satisfactory results if there are multiple occurrences of 'text to link from' in 'file-to-link-from'
    
* Linker will add an id to the __first__ HTML element of the __first__ occurrence of '<html>to link to' in 'file-to-link-to'
    e.g. `<h1 id="ref1"><span class="label">División I</span>Los Grandes Días de Expectación`
    Again, if there are multiple occurrences of '<html>to link to' Linker will always tag the first exact match
    
-Peter Turner