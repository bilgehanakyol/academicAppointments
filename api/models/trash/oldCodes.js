// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
//     const userDoc = await UserModel.create({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     res.json(userDoc);
//   } catch (e) {
//     console.error(e);
//     res.status(422).json(e);
//   }
// });

// app.post('/register', async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
//     const userDoc = await UserModel.create({
//       name,
//       email,
//       password: hashedPassword,
//       role, // Role (student veya academician) ekliyoruz
//     });
//     res.json(userDoc);
//   } catch (e) {
//     console.error(e);
//     res.status(422).json(e);
//   }
// });

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const userDoc = await UserModel.findOne({ email });
//     if (userDoc) {
//       const passOk = bcrypt.compareSync(password, userDoc.password);
//       if (passOk) {
//         jwt.sign({
//           email: userDoc.email,
//           id: userDoc._id,
//         }, jwtSecret, {}, (err, token) => {
//           if (err) {
//             console.error(err);
//             res.status(500).json('Internal server error');
//             return;
//           }
//           res.cookie('token', token, { httpOnly: true }).json(userDoc);
//         });
//       } else {
//         res.status(422).json('Password is not correct');
//       }
//     } else {
//       res.status(404).json('User not found');
//     }
//   } catch (e) {
//     console.error(e);
//     res.status(500).json('Internal server error');
//   }
// });

// app.get('/profile', (req, res) => {
//   const {token} = req.cookies;
//   if (token) {
//       jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//           if (err) throw err;
//           const {name, email, _id} = await UserModel.findById(userData.id);
//           res.json({name, email, _id});
//       });
//   } else {
//       res.json(null);
//   }
// });