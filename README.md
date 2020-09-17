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
test account
```
common user(feel free to register):
  nickname: user1
  password: 12345

admin user:
  nickname: user201
  password: admin
```
## How it works
```
sign up as a common user:
![image](https://user-images.githubusercontent.com/14156164/93525924-8fb18400-f8eb-11ea-8a40-c60b8427abce.png)
```
A common user:
```
1. See a list of songs / artists that you added to your library
2. add a song in your library
3. delete a song in your library
```
An administrator
```
![image](https://user-images.githubusercontent.com/14156164/93403094-69cca680-f83b-11ea-8fe5-e629cec3358e.png)
```
## License

This project is licensed under the MIT License (see the
[LICENSE](LICENSE) file for details).
