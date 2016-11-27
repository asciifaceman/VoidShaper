# Void Shaper by AsciiFaceman
----
Genistars, the void, Querencia, shaping. All of this came from the brilliant mind of Peter F. Hamilton. I hope I have the opportunity to ask his forgiveness for using his amazing concepts for a feeble idle game.

You can read more mythos in [MYTHOS.md](MYTHOS.md)

----

### Development Environment
If you are on windows I cannot really provide any help or input on how you get something to work, I am primarily a linux guy and haven't used windows for more than playing games since *Windows 7*. 

If you are interested in forking or contributing to VoidShaper, as of this writing there isn't much required. The only primary dependency is **Phaser 2.6.2**, which is bundled in `lib/`. On OSX or LINUX you should only need to check if python is installed, 

```
15:29 $ python --version
Python 2.7.10
```

Python is used for `dev.sh` which you can run on mac/linux by entering the directory in a terminal and running it `./dev.sh`.
```
15:30 $ ./dev.sh
Serving HTTP on 0.0.0.0 port 8000 ...
```

`http://localhost:8000/` should now be browsable for you.

**Note:** This may change, but right now it works perfectly for me.
### NPM / Grunt
You may notice NPM and Grunt resources in the repo. Do not worry about it right now, they are there but I have not integrated them into anything yet. As of this writing, they aren't really necessary.

----
### Licensing
Within [LICENSE.md](LICENSE.md) you will find the `GNU GENERAL PUBLIC LICENSE` that applies to the code within. This does not apply to the IP being used, which is attributed to Random House / Peter F. Hamilton. We will cease usage of this IP at their request, but be very depressed about it. 