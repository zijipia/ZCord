module.exports = class Guild {
	constructor(data, client) {
		this.client = client;
		this.id = data?.id;
		this.name = data?.name;
		this.icon = data?.icon;
		this.icon_hash = data?.icon_hash;
		this.splash = data?.splash;
		this.discovery_splash = data?.discovery_splash;
		this.owner = data?.owner;
		this.owner_id = data?.owner_id;
		this.permissions = data?.permissions;
		this.region = data?.region;
		this.afk_channel_id = data?.afk_channel_id;
		this.afk_timeout = data?.afk_timeout;
		this.widget_enabled = data?.widget_enabled;
		this.widget_channel_id = data?.widget_channel_id;
		this.verification_level = data?.verification_level;
		this.default_message_notifications = data?.default_message_notifications;
		this.explicit_content_filter = data?.explicit_content_filter;
		this.role = data?.role || [];
		this.emojis = data?.emojis || [];
		this.features = data?.features || [];
		this.mfa_level = data?.mfa_level;
		this.application_id = data?.application_id;
		this.system_channel_id = data?.system_channel_id;
		this.system_channel_flags = data?.system_channel_flags;
		this.rules_channel_id = data?.rules_channel_id;
		this.max_presences = data?.max_presences || null;
		this.max_members = data?.max_members || null;
		this.vanity_url_code = data?.vanity_url_code;
		this.description = data?.description || null;
		this.banner = data?.banner || null;
		this.premium_tier = data?.premium_tier;
		this.premium_subscription_count = data?.premium_subscription_count || null;
		this.preferred_locale = data?.preferred_locale;
		this.public_updates_channel_id = data?.public_updates_channel_id;
		this.max_video_channel_users = data?.max_video_channel_users || null;
		this.max_stage_video_channel_users = data?.max_stage_video_channel_users || null;
		this.approximate_member_count = data?.approximate_member_count || null;
		this.approximate_presence_count = data?.approximate_presence_count || null;
		this.welcome_screen = data?.welcome_screen || null;
		this.nsfw_level = data?.nsfw_level || null;
		this.stickers = data?.stickers || [];
		this.premium_progress_bar_enabled = data?.premium_progress_bar_enabled || null;
		this.safety_alerts_channel_id = data?.safety_alerts_channel_id || null;
		this.incidents_data = data?.incidents_data || null;
	}
	get BannerURL() {
		if (!this.banner) return null;
		if (this.banner.startsWith("a_")) {
			return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.gif?size=1024`;
		}
		return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png?size=1024`;
	}

	get IconURL() {
		if (!this.icon) return null;
		if (this.icon.startsWith("a_")) {
			return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.gif?size=1024`;
		}
		return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png?size=1024`;
	}
	get SplashURL() {
		if (!this.splash) return null;
		if (this.splash.startsWith("a_")) {
			return `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.gif?size=1024`;
		}
		return `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.png?size=1024`;
	}

	setNickname = async (nickname) => {
		return this.client.api.patch(`/guilds/${this.id}/members/@me`, { nick: nickname });
	};
};
