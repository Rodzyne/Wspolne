module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Sprawdź Czy Członek",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Warunki",

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "Lasse & MrGold",

// The version of the mod (Defaults to 1.0.0)
version: "1.9", //Added in 1.8.8

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Check if a member meets the conditions.",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
	return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["member", "varName", "info", "varName2", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions.
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information,
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use.
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels,
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
<div>
	<div style="float: left; width: 35%;">
		Członek:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Nazwa Zmiennej:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Sprawdź Czy Członek:<br>
		<select id="info" class="round">
			<option value="0" selected>Jest Botem</option>
			<option value="2">Może Zostać Wyrzucony</option>
			<option value="1">Może Zostać Zbanowany</option>
			<option value="4">Jest Na Kanale Głosowym</option>
			<option value="5">Czy Może Zarządzać Członkami?</option>
      <option value="6">Jest Właścicielem Bota?</option>
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Nazwa Zmiennej:<br>
		<input id="varName2" class="round" type="text" list="variableList2"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	${data.conditions[0]}
</div>`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
	const {glob, document} = this;

	glob.memberChange(document.getElementById('member'), 'varNameContainer');
	glob.onChangeTrue(document.getElementById('iftrue'));
	glob.onChangeFalse(document.getElementById('iffalse'));
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const data = cache.actions[cache.index];

	const type = parseInt(data.member);
	const varName = this.evalMessage(data.varName, cache);
	const member = this.getMember(type, varName, cache);

	const type2 = parseInt(data.role);
	const varName2 = this.evalMessage(data.varName2, cache);
	const info = parseInt(data.info);
	
	const dibiem = this.getDBM();

	let result = false;
	switch(info) {
		case 0:
			result = Boolean(member.user.bot);
			break;
		case 1:
			result = Boolean(member.bannable);
			break;
		case 2:
			result = Boolean(member.kickable);
			break;
		// case 3:
		// 	result = Boolean(member.speaking);
		// 	break; //Do not ask me why this is not working... ~Lasse
		case 4:
			if(member.voiceChannelID !== undefined) {
				result = true;
			} else {
				result = false;
			}
			break;
		case 5:
			result = member.manageable;
			break;
		case 6:
			if(member.id == dibiem.Files.data.settings.ownerId) {
				result = true;
			} else {
				result = false;
			}
			break;
		default:
			break;
	}
	this.executeResults(result, data, cache);
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module
