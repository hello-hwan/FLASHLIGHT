const business = require('./sqls/business.js');             //영업
const equipments = require('./sqls/equipments.js');         //설비
const logistics = require('./sqls/logistics.js');           //물류
const materials = require('./sqls/materials.js');           //자재
const production = require('./sqls/production.js');         //생산
const quality = require('./sqls/quality.js');               //품질
const standardInfo = require('./sqls/standard_info.js');    //기준정보
const statistisc = require('./sqls/statistics.js');         //통계


module.exports = {
    ...business,
    ...equipments,
    ...logistics,
    ...materials,
    ...production,
    ...quality,
    ...standardInfo,
    ...statistisc
};