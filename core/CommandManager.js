class CommandManager {
	constructor(client) {
		this.client = client;
	}

	async registerGlobal(commands) {
		this.client.debug("Registering global commands", commands);
		return this.client.api.put(`/applications/${this.client.user.id}/commands`, commands);
	}

	async registerGuild(guildId, commands) {
		this.client.debug("Registering guild commands", { guildId, commands });
		return this.client.api.post(`/applications/${this.client.user.id}/guilds/${guildId}/commands`, commands);
	}

	async safeRegisterGlobal(commands) {
		const existing = await this.getGlobal();
		const preserved = existing.filter((cmd) => !commands.some((c) => c.name === cmd.name));
		return this.registerGlobal([...preserved, ...commands]);
	}

	async getGlobal() {
		this.client.debug("Fetching global commands");
		return this.client.api.get(`/applications/${this.client.user.id}/commands`);
	}

	async getGuild(guildId) {
		this.client.debug("Fetching guild commands for", guildId);
		return this.client.api.get(`/applications/${this.client.user.id}/guilds/${guildId}/commands`);
	}

	async deleteGlobalCommand(commandId) {
		this.client.debug("Deleting global command", commandId);
		return this.client.api.delete(`/applications/${this.client.user.id}/commands/${commandId}`);
	}

	async deleteGuildCommand(guildId, commandId) {
		this.client.debug("Deleting guild command", { guildId, commandId });
		return this.client.api.delete(`/applications/${this.client.user.id}/guilds/${guildId}/commands/${commandId}`, []);
	}

	async clearGlobalCommands() {
		this.client.debug("Clearing all global commands");
		return this.client.api.put(`/applications/${this.client.user.id}/commands`, []);
	}

	async clearGuildCommands(guildId) {
		this.client.debug("Clearing all guild commands for", guildId);
		return this.client.api.put(`/applications/${this.client.user.id}/guilds/${guildId}/commands`, []);
	}
}

module.exports = CommandManager;
