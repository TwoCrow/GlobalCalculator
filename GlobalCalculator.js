extractRoll = function(msg){
    return _.chain(msg.inlinerolls)
        .reduce(function(m,v,k){
            m['$[['+k+']]']=v.results.total || 0;
            return m;
        },{})
        .reduce(function(m,v,k){
            return m.replace(k,v);
        },msg.content)
        .value();
}

findRollResult = function(msg, rollname, isString = 0){
	let pattern = new RegExp('{{' + rollname + '=(.+?)}}');
	let result = 0;
	if (isString > 0) {
		msg.content.replace(pattern,(match,rollResult)=>{
			result = rollResult;
		});
	} else {
		msg.content.replace(pattern,(match,rollResult)=>{
		result = parseInt(rollResult);
		});
	}
	return result;
}

on("chat:message", function(orig_msg) {
    if (orig_msg.rolltemplate && orig_msg.inlinerolls) {
        if(/r1/.test(orig_msg.content) || /r2/.test(orig_msg.content)){
            let msg = _.clone(orig_msg),
				damageType, damageBase, damageCrit, atk1, atk2, critTarget, charName;
			damageBase = damageCrit = atk1 = atk2 = crits = 0;
			damageType = charName = advantage = normal = disadvantage = always = critBtn = critDmg ='';
			
			msg.content = extractRoll(msg);
			msg.content.replace(/charname=(.+?)$/,(match,charname)=>{
				charName = charname;
			});
			damageType = findRollResult(msg, 'dmg1type', 1);
			damageBase = findRollResult(msg, 'dmg1') + findRollResult(msg, 'dmg2') + findRollResult(msg, 'hldmg') + findRollResult(msg, 'globaldamage'); 
			damageCrit = damageBase + findRollResult(msg, 'crit1') + findRollResult(msg, 'crit2') + findRollResult(msg, 'hldmgcrit') + findRollResult(msg, 'globaldamagecrit');
			
			advantage = findRollResult(msg, 'advantage');
			normal = findRollResult(msg, 'normal');
			disadvantage = findRollResult(msg, 'disadvantage');
			always = findRollResult(msg, 'always');

			r1 = findRollResult(msg, 'r1');
			r2 = findRollResult(msg, 'r2');
			globalAttack = findRollResult(msg, 'globalattack');
			global = findRollResult(msg, 'global');

            rollTotal1 = findRollResult(msg, 'r1') + findRollResult(msg, 'globalattack') + findRollResult(msg, 'global');
            rollTotal2 = findRollResult(msg, 'r2') + findRollResult(msg, 'globalattack') + findRollResult(msg, 'global');

			// Only print something to chat if an actual calculation worth of our time took place (i.e. anything that adds a number that's not 0)
			if (globalAttack != 0 || global != 0)
			{
				// If it's a single roll, display only the sum for r1.
				if (normal == 1)
				{
					sendChat(msg.who, '<h2 style=\"outline:double; text-align:center; max-width:185px; color:black; background-color:white; font-size:22px\">' + rollTotal1 + '</h2>');
				}
				// Otherwise, we need to display both, though the highlighting conditions will be different.
				else if (always == 1)
				{
					sendChat(msg.who, '<h2 style=\"outline:double; text-align:center; max-width:185px; color:black; background-color:white; font-size:22px; white-space:pre-wrap\">' + rollTotal1 + "     |     " + rollTotal2 + '</h2>');
				}
				else if (advantage == 1)
				{
					if (rollTotal1 >= rollTotal2)
					{
						sendChat(msg.who, '<h2 style=\"outline:double; text-align:center; max-width:185px; background-color:white; \"><span style=\"color:black;font-size:22px; white-space:pre-wrap\">' + rollTotal1 + "</span><span style=\"color:black; font-size:22px; white-space:pre-wrap; color:lightgrey\">" + "     |     " + rollTotal2 + '</span></h2>');
					}
					else
					{
						sendChat(msg.who, '<h2 style=\"outline:double; text-align:center; max-width:185px; background-color:white; \"><span style=\"color:black;font-size:22px; white-space:pre-wrap; color:lightgrey\">' + rollTotal1 + "</span><span style=\"color:black; font-size:22px; white-space:pre-wrap\">" + "     |     " + rollTotal2 + '</span></h2>');
					}
				}
				else if (disadvantage == 1)
				{
					if (rollTotal1 <= rollTotal2)
					{
						sendChat(msg.who, '<h2 style=\"outline:double; text-align:center; max-width:185px; background-color:white; \"><span style=\"color:black;font-size:22px; white-space:pre-wrap\">' + rollTotal1 + "</span><span style=\"color:black; font-size:22px; white-space:pre-wrap; color:lightgrey\">" + "     |     " + rollTotal2 + '</span></h2>');
					}
					else
					{
						sendChat(msg.who, '<h2 style=\"outline:double; text-align:center; max-width:185px; background-color:white; \"><span style=\"color:black;font-size:22px; white-space:pre-wrap; color:lightgrey\">' + rollTotal1 + "</span><span style=\"color:black; font-size:22px; white-space:pre-wrap\">" + "     |     " + rollTotal2 + '</span></h2>');
					}
				}
			}
        }
		else if (/{{dmg\d=/.test(orig_msg.content)){
			let msg = _.clone(orig_msg),
				damageType, damageBase, damageCrit, atk1, atk2, critTarget, charName;
			damageBase = damageCrit = atk1 = atk2 = crits = 0;
			damageType = charName = advantage = normal = disadvantage = always = critBtn = critDmg ='';
			
			msg.content = extractRoll(msg);
			msg.content.replace(/charname=(.+?)$/,(match,charname)=>{
				charName = charname;
			});
			damageType = findRollResult(msg, 'dmg1type', 1);
			damageBase = findRollResult(msg, 'dmg1') + findRollResult(msg, 'dmg2'); 
			damageMod = findRollResult(msg, 'hldmg') + findRollResult(msg, 'globaldamage') + findRollResult(msg, 'crit1') + findRollResult(msg, 'crit2') + findRollResult(msg, 'hldmgcrit') + findRollResult(msg, 'globaldamagecrit');
			
			advantage = findRollResult(msg, 'advantage');
			normal = findRollResult(msg, 'normal');
			disadvantage = findRollResult(msg, 'disadvantage');
			always = findRollResult(msg, 'always');

			damageTotal = damageBase + damageMod;

			if (damageMod != 0)
			{
				sendChat(msg.who, '<h2 style=\"outline:double; text-align:center; max-width:185px; color:black; background-color:white; font-size:22px\">' + damageTotal + '</h2>');
			}
		}
    }
});