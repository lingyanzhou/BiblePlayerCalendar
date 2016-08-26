# BiblePlayerCalendar
Intro
-------------
Bootstrap, JQuery powered bible audio player with an annual calendar schedule.
Feature:
* The calendar view helps you keep up with your schedule.
* Convenient. Audios can be add, delete from the playlist. 
* Carefree. Looping and playlist enables you to listen while driving.
* You can view text of the audio.

[Sample site](http://bibleplayer-lingyanzhou.rhcloud.com/) (Disclaimer: Bible texts and audios are from www.inchrist.cn.)



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
Screenshots
-----------
* On large screens:

![screenshot-lg](https://cloud.githubusercontent.com/assets/13041926/18015511/e1681c88-6b7c-11e6-903b-994e04c1350e.png)


* On small screens, with text view:

![screenshot-md-text](https://cloud.githubusercontent.com/assets/13041926/18015512/e17e1812-6b7c-11e6-9504-5556761f0235.png)


* On small screens:

![screenshot-sm](https://cloud.githubusercontent.com/assets/13041926/18015514/e198923c-6b7c-11e6-8e36-33c35be59e40.png)


* Collapsable calendar view:

![screenshot-sm-month-collapsed](https://cloud.githubusercontent.com/assets/13041926/18015635/5f570032-6b7d-11e6-9f93-c9d638172c40.png)


![screenshot-sm-month-expanded](https://cloud.githubusercontent.com/assets/13041926/18015515/e1a41cc4-6b7c-11e6-9767-a482779910e9.png)

