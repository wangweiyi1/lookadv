function logTypeToText(logType){
	switch(logType){
		case 1:
			logType=i18n("imp");
			break;
		case 2:
			logType=i18n("click");
			break;
		case 3:
			logType=i18n("cvt");
			break;
		case 4:
			logType=i18n("reach");
			break;
	}
	return logType;
}