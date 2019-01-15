/**************************************************
 * Created by nanyuantingfeng on 26/05/2017 18:05.
 **************************************************/
const util = require('./util')

function calculateVersion(program) {
  return util.getAllTags()

    .then(result => {
      let version = util.getCWDPackageVersion();
      let tags = util.split(result.stdout);
      const { isProduction, isNoBeta, isMinio, suffix = "" } = program;
      tags = util.searchUseVersion(
        tags,
        version,
        isProduction,
        isNoBeta,
        isMinio,
        suffix
      );

      let buildNo = 0;

      if (tags.length > 0) {
        buildNo = util.getBuildNo(tags[0]);
        buildNo += 1;
      }

      let p = isProduction ? "" : "v";
      let n = isNoBeta ? "-noBeta" : "";
      let m = isMinio ? "-minio" : "";
      let s = suffix ? "-" + suffix : "";

      return p + version + "." + buildNo + n + m + s;
    });
}

function tags(program) {
  return calculateVersion(program)
    .then(tag => {
      console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', tag)
      return util.pushNewTag(tag)
    }).catch(e => {
      console.error(e)
    })
}

tags.calculateVersion = calculateVersion

module.exports = tags

