# Music Library

*A music library*

![image](https://user-images.githubusercontent.com/14156164/93402918-ee6af500-f83a-11ea-83e2-79f512c905cc.png)



## Installation

clone:
```
$ git clone https://github.com/LiJinfen/mlibrary.git
$ cd mlibrary
```
create & activate virtual env then install dependency:

with venv/virtualenv + pip:
```
$ python -m venv env  # use `virtualenv env` for Python2, use `python3` for Python3 on Linux & macOS
$ source env/bin/activate  # use `env\Scripts\activate` on Windows
$ pip install -r requirements.txt  # use `pip3` for Python3 on Linux & macOS
```
or with Pipenv:
```
$ pipenv install --dev
$ pipenv shell
```
generate fake data then run:
```
$ flask forge
$ flask run
* Running on http://127.0.0.1:5000/
```

## How it works

A common user:
1. See a list of songs / artists that you added to your library
2. add a song in your library
3. delete a song in your library

An administrator
![image](https://user-images.githubusercontent.com/14156164/93403094-69cca680-f83b-11ea-8fe5-e629cec3358e.png)
## License

This project is licensed under the MIT License (see the
[LICENSE](LICENSE) file for details).
