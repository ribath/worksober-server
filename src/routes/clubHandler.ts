import express, { Request, Response } from 'express'
import multer from 'multer'
import fs from 'fs'
import { resizeImg, readFileAsync } from '../utility/helper'
import User from '../interfaces/user'
import { model } from 'mongoose'
import userSchema from '../schemas/userSchema'
import MyResponse from '../interfaces/response'

const router = express.Router()

const UserModel = model<User>('User', userSchema)

const upload = multer({ dest: 'uploads/' })

router.get('/', async (req:Request, res:Response) => {
  await UserModel.find({ })
    .select({
      email: 0,
      adress1: 0,
      adress2: 0,
      profilePic: 0
    })
    .exec((err, data) => {
      let myResponse:MyResponse
      if (err) {
        myResponse = { status: 500, message: 'There was a server side error!' }
        res.status(500).json(myResponse)
      } else {
        myResponse = { status: 200, message: 'User List!', result: data }
        res.status(200).json(myResponse)
      }
    })
})

router.get('/:id', async (req:Request, res:Response) => {
  await UserModel.find({ _id: req.params.id }, (err, data) => {
    let myResponse:MyResponse
    if (err) {
      myResponse = { status: 500, message: 'There was a server side error!' }
      res.status(500).json(myResponse)
    } else {
      myResponse = { status: 200, message: 'User Found!', result: data }
      res.status(200).json(myResponse)
    }
  })
})

router.post('/', upload.single('avatar'), async (req:Request, res:Response) => {
  let myResponse:MyResponse
  if (req.body.name !== undefined &&
    req.body.email !== undefined &&
    req.body.age !== undefined &&
    req.body.sex !== undefined &&
    req.body.member !== undefined &&
    req.file) {
    const avatar = await readFileAsync(req.file.path)
    fs.unlink(req.file.path, () => { })
    const profilePic = await resizeImg(avatar, 512)
    const profilePicThumbnail = await resizeImg(avatar, 50)

    const newUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      sex: req.body.sex,
      adress1: req.body.adress1,
      adress2: req.body.adress2,
      member: req.body.member,
      profilePic: profilePic,
      profilePicThumbnail: profilePicThumbnail
    })

    await newUser.save((err) => {
      if (err) {
        myResponse = { status: 500, message: 'There was a server side error!' }
        res.status(500).json(myResponse)
      } else {
        myResponse = { status: 201, message: 'New User created successfully!' }
        res.status(201).json(myResponse)
      }
    })
  } else {
    myResponse = { status: 400, message: 'Request is not acceptable!' }
    res.status(400).json(myResponse)
  }
})

router.put('/:id', upload.single('avatar'), async (req:Request, res:Response) => {
  let myResponse:MyResponse
  if (req.body.name !== undefined &&
    req.body.email !== undefined &&
    req.body.age !== undefined &&
    req.body.sex !== undefined &&
    req.body.member !== undefined &&
    req.file) {
    const avatar = await readFileAsync(req.file.path)
    fs.unlink(req.file.path, () => { })
    const profilePic = await resizeImg(avatar, 512)
    const profilePicThumbnail = await resizeImg(avatar, 60)

    await UserModel.updateOne({
      _id: req.params.id
    },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        sex: req.body.sex,
        adress1: req.body.adress1,
        adress2: req.body.adress2,
        member: req.body.member,
        profilePic: profilePic,
        profilePicThumbnail: profilePicThumbnail
      }
    }, { },
    (err) => {
      if (err) {
        myResponse = { status: 500, message: 'There was a server side error!' }
        res.status(500).json(myResponse)
      } else {
        myResponse = { status: 201, message: 'User edited successfully!' }
        res.status(201).json(myResponse)
      }
    })
  } else {
    myResponse = { status: 400, message: 'Request is not acceptable!' }
    res.status(400).json(myResponse)
  }
})

router.delete('/:id', async (req:Request, res:Response) => {
  await UserModel.deleteOne({ _id: req.params.id }, (err) => {
    let myResponse:MyResponse
    if (err) {
      myResponse = { status: 500, message: 'There was a server side error!' }
      res.status(500).json(myResponse)
    } else {
      myResponse = { status: 200, message: 'User deleted successfully!' }
      res.status(201).json(myResponse)
    }
  })
})

export default router
