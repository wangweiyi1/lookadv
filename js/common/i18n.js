/**
 * Created by wangweiyi on 17/2/20.
 */
var i18n_cn = {
	behaviourLabel:"网络行为",
    timestampLabel:"来访时间",
    cityNameLabel:"地点",
    demographicLabel:"人口属性",
    longTermInterestLabel:"个人关注",
    inMarketLabel:"购买倾向",
    impCounterLabel:"今日累计曝光量",
    clickCounterLabel:"今日累计点击量",
    reachCounterLabel:"今日累计到达量",
    cvtCounterLaebl:"今日累计转化量",
    details:"详情",
    imp:"曝光",
    click:"点击",
    reach:"网站访客",
    cvt:"转化",
    configRefresh:"开启/停止刷新",
    refreshFrequency:"自定义刷新频率",
    companySecond:"(单位:秒)",
    advertiserList:"广告主列表",
    allAdvertisers:"全部广告主",
    mapScaling:"地图缩放比例",
    openAutoRefresh:"开启自动刷新",
    closeAutoRefresh:"关闭自动刷新",
    originalImage:"查看原图",
    logout:"退出登录"
}
var i18n_en = {
	behaviourLabel:"Browsing Behavior",
    timestampLabel:"Time of Visit",
    cityNameLabel:"Location",
    demographicLabel:"Demographic",
    longTermInterestLabel:"Personal Interests",
    inMarketLabel:"Purchase Intent",
    impCounterLabel:"Total Impressions Today",
    clickCounterLabel:"Total Clicks Today",
    reachCounterLabel:"Click-Through Visits Today",
    cvtCounterLaebl:"Total Conversions Today",
    details:"Details",
	imp:"Impressions",
    click:"Clicks",
    reach:"Site Visitors",
    cvt:"Conversions",
    configRefresh:"Start/Stop Refresh",
    refreshFrequency:"Refresh Frequency",
    companySecond:"(Unit: Seconds)",
    advertiserList:"List of Advertisers",
    allAdvertisers:"All Advertisers",
    mapScaling:"Map Scale",
    openAutoRefresh:"Enable Auto Refresh",
    closeAutoRefresh:"Disable Auto Refresh",
    originalImage:"Original Image",
    logout:"Logout"
}
function i18n(key){
    var value = "";
    if(language.indexOf("zh") > -1){
        value = i18n_cn[key];
    }else if(language.indexOf("en") > -1){
        value = i18n_en[key];
    }else{
        value=key;
    }
    return value;
}
var vue_i18n = {
	behaviourLabel:i18n("behaviourLabel"),
	timestampLabel:i18n("timestampLabel"),
    cityNameLabel:i18n("cityNameLabel"),
    demographicLabel:i18n("demographicLabel"),
    longTermInterestLabel:i18n("longTermInterestLabel"),
    inMarketLabel:i18n("inMarketLabel"),
    impCounterLabel:i18n("impCounterLabel"),
    clickCounterLabel:i18n("clickCounterLabel"),
    reachCounterLabel:i18n("reachCounterLabel"),
    cvtCounterLaebl:i18n("cvtCounterLaebl"),
    details:i18n("details"),
    configRefresh:i18n("configRefresh"),
    refreshFrequency:i18n("refreshFrequency"),
    companySecond:i18n("CompanySecond"),
    advertiserList:i18n("advertiserList"),
    allAdvertisers:i18n("allAdvertisers"),
    mapScaling:i18n("mapScaling"),
    openAutoRefresh:i18n("openAutoRefresh"),
    closeAutoRefresh:i18n("closeAutoRefresh"),
    originalImage:i18n("originalImage"),
    logout:i18n("logout")
}