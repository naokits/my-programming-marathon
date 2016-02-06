JavaScript SDK for NiftyCloud mobile backend
------------------------------------------------------------
[![Build Status](https://travis-ci.org/NIFTYCloud-mbaas/ncmb_js.png)](https://travis-ci.org/NIFTYCloud-mbaas/ncmb_js)
[![Coverage Status](https://coveralls.io/repos/NIFTYCloud-mbaas/ncmb_js/badge.svg?branch=apply_coveralls&service=github)](https://coveralls.io/github/NIFTYCloud-mbaas/ncmb_js?branch=apply_coveralls)
[![Code Climate](https://codeclimate.com/github/NIFTYCloud-mbaas/ncmb_js/badges/gpa.svg)](https://codeclimate.com/github/NIFTYCloud-mbaas/ncmb_js)

## Install

```shell
$ npm install ncmb -S
```

## Getting Start

1. Create Account and create application.
2. Get API KEY / Client KEY
3. Write codes!

* Initialize

```javascript
var NCMB = NCMB || require("../lib/ncmb");
var ncmb = new NCMB("your_apikey", "your_clientkey");
```

* DataStore

```javascript
// get data from ncmb
var Food = ncmb.DataStore("Food");
Food.equalTo("name", "orange")
    .limit(3)
    .skip(1)
    .fetchAll()
    .then(function(foods){
      console.log(foods);
      foods[0].delete();
    })
    .catch(function(err){
      console.log(err);
    });

// cerate instance and save into ncmb
var food = new Food({name: "apple"});
food.save()
    .then(function(apple){
      console.log(apple);
    })
    .catch(function(err){
      console.log(err);
    });

```
* Push

```javascript
// send push notification
var push = new ncmb.Push()
push.set("title", "Hello, NCMB!")
    .send()
    .then(function(newPush){
      console.log(newPush);
    })
    .catch(function(err){
      console.log(err);
    });

```
* User

```javascript
//get data
ncmb.User.fetchAll()
    .then(function(users){
      console.log(users[0]);
    })
    .catch(function(err){
      console.log(err);
    });

// signup and login
var user = new ncmb.User({userName:"Tarou", password:"1234"});
user.signUpByAccount()
    .then(function(user){
      return ncmb.User.login(user);
    })
    .then(function(user){
      console.log(user.isCurrentUser); //true
      return user.set("NickName", "taro")
                 .update();
    })
    .then(function(user){
      ncmb.User.logout(user);
    })
    .catch(function(err){
      console.log(err);
    });

```

* File

```javascript
// download binary data
ncmb.File.download()
    .then(function(data){
        console.log(data);
      })
    .catch(function(err){
      console.log(err);
    });

// upload file (Case of Node.js)
var fs = require('fs');
fs.readFile("/filepath/test.text", function(err, data){
  if(err) throw err;
  ncmb.File.upload("upload.text", data)
      .then(function(data){
          console.log(data);
        })
      .catch(function(err){
          console.log(err);
        });
});

```

* Role

```javascript
// get role and subroles
ncmb.Role.fetchAll()
    .then(function(roles){
      return roles[0].fetchRole();
    })
    .then(function(subroles){
      console.log(subroles);
    })
    .catch(function(err){
      console.log(err);
    });

//set member and subrole
var role = new ncmb.Role("roleName");
role.addUser([user1,user2])
    .addRole([role1,role2])
    .save()
    .then(function(role){
      console.log(role);
    })
    .catch(function(err){
      console.log(err);
    });

```

* acl

```javascript
// set acl
var acl = new ncmb.Acl();
acl.setPublicReadAccess(false)
   .setRoleReadAccess("admin", true);
var Food = ncmb.DataStore("Food");
var food = new Food({name:"orange", acl:acl});
food.save()
    .then(function(food){
      console.log(food)
    })
    .catch(function(err){
      onsole.log(err);
    });

// check acl
ncmb.Role.equalTo("roleName", "admin")
         .fetch()
         .then(function(role){
            console.log(role.acl.get("public", "read"));
          })
         .catch(function(err){
            console.log(err);
          });
```

* Relation

```javascript
//set relation
var relation = new ncmb.Relation();
var Food = ncmb.DataStore("Food");
var food = new Food({name:"orange"});
relation.add(food);
var user = new ncmb.User({userName:"Hanako", password:"password"});
user.login()
.then(function(user){
  user.set("foods", relation);
  return user.update();
})
.catch(function(err){
  console.log(err);
});

// get related object
Food.relatedTo(user, "foods")
    .fetchAll()
    .then(function(food){
      console.log(food);
    })
    .catch(function(err){
      console.log(err);
    });
```

* GeoPoint

```javascript
// set geopoint
var point = new ncmb.GeoPoint(35, 135);
var Country = ncmb.DataStore("Country");
var Japan = new Country();
Japan.set("location", point);
Japan.save()
     .then(function(data){
        console.log(data);
      })
     .catch(function(err){
        console.log(err);
      });

```


## Use in Browser

```
$ browserify -r -p licensify -t [ uglifyify -x .js ] -o ncmb.min.js lib/ncmb.js
```

```javascript
<script src="js/ncmb.min.js"></script>
<script>
  var ncmb = new NCMB("your_apikey", "your_clientkey");
  ...
</script>
```


## For Developer

```shell
$ git clone XXX
$ cd javascript-sdk-mbaas
$ npm install
$ npm run stub:start
$ npm test
```
## License

Please read [LICENSE](git://github.com/NIFTYCloud-mbaas/ncmb_js/blob/master/LICENSE).