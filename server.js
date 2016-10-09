//app basic settings
const config = require('config'); //module handles configuration
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const strategy = require('passport-local');
const jwt = require('express-jwt');


//initialize express


