# BiblePlayerCalendar
Intro
-------------
Bootstrap, JQuery powered bible audio player with an annual calendar schedule.
Feature:
* The calendar view helps you keep up with your schedule.
* Convenient. Audios can be add, delete from the playlist. 
* Carefree. Looping and playlist enables you to listen while driving.
* You can view text of the audio.

Audio files
----------

* Audios are not included. 
* They should be arranged as below:
  * New Testament audios (total 364):
```
/xy1n1b/0001.mp3
       /0002.mp3
       ...
       /0010.mp3
       ...
       /0364.mp3
```

  * Old Testament audios (total 364):

```
/jy1n1b/0001.mp3
       /0002.mp3
       ...
       /0010.mp3
       ...
       /0364.mp3
```

Text files
----------
* Texts of the audio are not included. 

* The /biblecontent should contains new testament, old testament fragments.
 They each has 364 segments. Their content is html DIV content.

* They should be named like (for old testament):
```
  jy1n1b1.html
  jy1n1b2.html
  ...
  jy1n1b10.html
  ...
  jy1n1b364.html
```
and like (for new testament):
```
  xy1n1b1.html
  xy1n1b2.html
  ...
  xy1n1b10.html
  ...
  xy1n1b364.html
```
