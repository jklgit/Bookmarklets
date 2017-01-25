# Bookmarklets

Create a new bookmark and paste the given javascript-link. Online versions always use the updated code from github. Offline versions work with [NoScript](https://addons.mozilla.org/en-US/firefox/addon/noscript/), since those work without adding `<script>`-elements to the site.

## Copy Bookmarklet

Copy document title or post infos along with link to share with friends.

![copy example](https://raw.githubusercontent.com/jklgit/Bookmarklets/master/media/copy.gif)

<div style="text-align:center"><img src ="https://raw.githubusercontent.com/jklgit/Bookmarklets/master/media/copy.gif" /></div>

Online version:

```
javascript:var%20watchingSankakuUsers=[];(function()%7Bfunction%20callback()%7B%7Dvar%20s%3Ddocument.createElement(%22script%22)%3Bs.src%3D%22https%3A%2F%2Fjklgit.github.io%2FBookmarklets%2Fsrc%2Fcopy.js%22%3Bif(s.addEventListener)%7Bs.addEventListener(%22load%22%2Ccallback%2Cfalse)%7Delse%20if(s.readyState)%7Bs.onreadystatechange%3Dcallback%7Ddocument.body.appendChild(s)%3Bdocument.body.removeChild(s)%3B%7D)()
```

[Offline version](https://raw.githubusercontent.com/jklgit/Bookmarklets/master/src/copy_offline.js)

## Video Finder

Find video files in the current document.

Online version:

```
javascript:(function()%7Bfunction%20callback()%7B%7Dvar%20s%3Ddocument.createElement(%22script%22)%3Bs.src%3D%22https%3A%2F%2Fjklgit.github.io%2FBookmarklets%2Fsrc%2Fvidfinder.js%22%3Bif(s.addEventListener)%7Bs.addEventListener(%22load%22%2Ccallback%2Cfalse)%7Delse%20if(s.readyState)%7Bs.onreadystatechange%3Dcallback%7Ddocument.body.appendChild(s)%3Bdocument.body.removeChild(s)%3B%7D)()
```
[Offline version](https://raw.githubusercontent.com/jklgit/Bookmarklets/master/src/vidfinder_offline.js)
