Template.registerHelper("stringify", function(o) {
	if (!o) return o;
	return JSON.stringify(o);
});
Template.registerHelper("currentUser", function(input) {
	return Session.get("userMail") === input;

});