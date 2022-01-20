const functions = require('firebase-functions');
const { success, fail } = require('../../lib/util');
const sc = require('../../constants/statusCode');
const rm = require('../../constants/responseMessage');
const db = require('../../db/db');
const { studioDB } = require('../../db');
const { slack } = require('../../other/slack/slack');

/**
 * @주변_스튜디오_위치_조회
 * @desc 유저 근처/주변의 스튜디오 위치를 조회해요
 */
module.exports = async (req, res) => {
  let client;

  try {
    client = await db.connect(req);

    const studios = await studioDB.getNearbyStudio(client);
    if (!studios) return res.status(sc.NO_CONTENT).send(fail(sc.NO_CONTENT, rm.NO_STUDIO));
    const data = { studios };

    res.status(sc.OK).send(success(sc.OK, rm.READ_ALL_STUDIO_SUCCESS, data));
  } catch (error) {
    slack(req, error.message);
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
