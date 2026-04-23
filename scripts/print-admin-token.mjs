import './load-local-env.mjs';
import { createDailyAdminToken, getAdminPasswordHint } from '../lib/admin-auth.mjs';

const hint = getAdminPasswordHint();

console.log(`Date du jour (Europe/Paris) : ${hint.dateStamp}`);
console.log(`Variables d'environnement attendues : ${hint.requiredEnvironment.join(', ')}`);

for (const scopeDefinition of hint.scopes) {
	try {
		console.log(`JWT ${scopeDefinition.name} du jour : ${createDailyAdminToken(scopeDefinition.name, hint.dateStamp)}`);
	} catch (error) {
		console.log(`JWT ${scopeDefinition.name} indisponible : ${error.message}`);
	}
}