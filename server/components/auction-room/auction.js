/**
 * Created by ChristianFernando on 12/26/2015.
 */
/**
 * Created by ChristianFernando on 10/31/2015.
 */
'use strict';

var _ = require('lodash');
//var utils = require('../utils');
var auctionData = null;
var UserModel = require('./../../api/user/user.model');
var flag = false;
var timeOut;

var verify = function (io) {
  var t1 = new Date();
  var t2 = new Date(auctionData.start_at);
  var dif = t1.getTime() - t2.getTime();

  var Seconds_from_T1_to_T2 = dif / 1000;
  var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
  Seconds_Between_Dates = parseInt(Seconds_Between_Dates)

  console.log('seconds',Seconds_Between_Dates);
  if(Seconds_Between_Dates<=90){
    auctionData.left = Seconds_Between_Dates;


    io.sockets.emit('check auction active', {
      payload: auctionData,
    });
  }
  return Seconds_Between_Dates;
};

var getSeconds = function () {
  var t1 = new Date();
  var t2 = new Date(auctionData.start_at);
  var dif = t1.getTime() - t2.getTime();

  var Seconds_from_T1_to_T2 = dif / 1000;
  var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
  Seconds_Between_Dates = parseInt(Seconds_Between_Dates)


  return Seconds_Between_Dates;
};

var checkSecondsRemainders = function (io) {
  var seconds = getSeconds();
  console.log('checkSecondsRemainders',seconds);
  if((90-seconds)<10){
    //auctionData.start_at=Date.now()
    clearTimeout(timeOut);

    io.sockets.emit('restore 10 seconds', {
      payload: auctionData
    });

    timeOut = setTimeout(function () {
      console.log('done1');
      UserModel.updateUser(auctionData, function (err, result) {

      })
      io.sockets.emit('finish auction', {
        payload: auctionData
      });
      setTimeout(function () {
        auctionData=null;
        io.sockets.emit('check auction active', {
          payload: null
        });
      }, 10*1000);
    }, 10*1000);
  }else
    verify(io)
}

module.exports = function (io) {

  io.on('connection', function (socket) {

    socket.on('force check auction active', function () {
      if(auctionData){
        verify(io);
      }
    });

    socket.on('start auction', function (data) {
      console.log('auction',data);
      if(!auctionData){
        auctionData = {
          idSeller: data.idSeller,
          seller:data.seller,
          idItem:data.idItem,
          itemName:data.itemName,
          cant:data.cant,
          image:data.image,
          minBid:data.minBid,
          start_at:Date.now()
        };

        console.log('auctionData',auctionData);
        verify(io);
        timeOut = setTimeout(function () {
          console.log('done0');
          UserModel.updateUser(auctionData, function (err, result) {

          })
          io.sockets.emit('finish auction', {
            payload: auctionData
          });
          setTimeout(function () {
          auctionData=null;
            io.sockets.emit('check auction active', {
              payload: null
            });
          }, 10*1000);


        }, 90*1000);
      }
    });


    socket.on('bet auction', function (data) {

      if(auctionData.winBid && data.bid>auctionData.winBid){

        auctionData.idBettor = data.idBettor;
        auctionData.usernameBettor = data.usernameBettor;
        auctionData.winBid = data.bid;
        checkSecondsRemainders(io);
      }
      else if(data.bid>=auctionData.minBid && !auctionData.winBid){
        auctionData.idBettor = data.idBettor;
        auctionData.usernameBettor = data.usernameBettor;
        auctionData.winBid = data.bid;
        checkSecondsRemainders(io);
      }
      else{
        //error;
      }


    });



    socket.on('disconnect', function () {
      console.info('[%s] DISCONNECTED', socket.address);
    });



  });

};
