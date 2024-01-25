const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js'); //imports necessary functions from discord.js
const noblox = require('noblox.js');

module.exports = { //data that will be exported so it can be used in deploy-commands.js
	data: new SlashCommandBuilder()
		.setName('blacklist_user') //the name of the command
		.setDescription('Blacklist a user from Thoughtful Therapy') //the description of the command
		.addUserOption(option =>
            option
                .setName('user_server')
                .setDescription('The user you want to blacklist (if they are in the server)'))
        .addStringOption(option =>
            option
                .setName('user_rblx')
                .setDescription('If the user is in the server or not'))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for blacklisting the user'))
        .addStringOption(option =>
            option
                .setName('evidence')
                .setDescription('The evidence for blacklisting the user (link)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
			
    async execute(interaction) {
		//Main Variables 
		const user_server = interaction.options.getMember('user_server');
		const user_rblx = interaction.options.getString('user_rblx');
		const reason = interaction.options.getString('reason');
		const evidence = interaction.options.getString('evidence');
		const modID = String(Math.ceil(Math.random() * (10000000000 - 1000000000) + 1000000000));
        const blacklistChannel = interaction.client.channels.cache.get('1190135960613167215');
		const modLogChannel = interaction.client.channels.cache.get('1165408598017462412');

		//Noblox Variables
		//Noblox for Server Users
		if(user_server && !user_rblx){
		const user_server_string = user_server.displayName;
		const user_server_usernameID = await noblox.getIdFromUsername(user_server_string);
		let user_server_avatar_start = await noblox.getPlayerThumbnail(user_server_usernameID, 420, "png", true, "Headshot");
		let user_server_avatar_Final = user_server_avatar_start[0].imageUrl;
		//Blacklist Embeds
		//Blacklist Embeds for Server Users
		const serverBlacklistChannelEmbed = new EmbedBuilder()
			.setThumbnail(user_server_avatar_Final)
			.setTitle('New User Blacklisted')
			.setDescription('A new user has been blacklisted, more information is located below:')
			.setColor('#77dd77')
			.addFields(
				{ name: 'Blacklist ID:', value: `${modID}`, inline: false },
				{ name: 'User Blacklisted:', value: `${user_server}`, inline: false },
				{ name: 'Reason:', value: `${reason}`, inline: false },
				{ name: 'Evidence:', value: `${evidence}`, inline: false },
				{ name: 'Additional Information:', value: `${user_server} has been blacklisted from Thoughtful Therapy. This means that they can't enter the store or be in any area of Thoughtful Therapy operation. If this user is an employee, they have been terminated. If you see the user on Thoughtful Therapy property, in an area of company operation, or is harassing the company, contact a Manager+. If this blacklisting is false, please contact a Manager+.`},
			);
		serverBlacklistChannelEmbed.setFooter({
			iconURL: 'https://cdn.discordapp.com/attachments/1150258402157678664/1154182022613450804/Thoughtful_Therapy_Logo.png',
			text: 'TherapyBot v1.7 Alpha, Operated by Thoughtful Therapy',
		});

		const serverblacklistLogEmbed = new EmbedBuilder()
			.setThumbnail('https://cdn.discordapp.com/attachments/1150258402157678664/1154182022613450804/Thoughtful_Therapy_Logo.png')
			.setTitle('Moderation Log (Blacklisting)')
			.setDescription('This is a moderation log used to notify that a user has been blacklisted from Thoughtful Therapy, DO NOT DELETE THIS LOG')
			.setColor('#77dd77')
			.addFields(
				{ name: 'Moderation Action:', value: `Blacklisting`, inline: false },
				{ name: 'Log ID:', value: `${modID}`, inline: false },
				{ name: 'User Blacklisted:', value: `${user_server}`, inline: false },
				{ name: 'Reason:', value: `${reason}`, inline: false },
				{ name: 'Evidence:', value: `${evidence}`, inline: false },
				{ name: 'Moderator:', value: `${interaction.member.displayName}`, inline: false },
				{ name: 'Additional Information:', value: `${user_server} has been blacklisted from all areas of Thoughtful Therapy operation including the main store. If the user enters the main store or an area of operation, please take moderation action against them and call the in-game police to tresspass them. If the user was an employee, they have already been terminated. If this blacklisting appears to be false, please contact a Represenative+.`, inline: false },
			);

		serverblacklistLogEmbed.setFooter({
			iconURL: 'https://cdn.discordapp.com/attachments/1150258402157678664/1154182022613450804/Thoughtful_Therapy_Logo.png',
			text: 'TherapyBot v1.7 Alpha, Operated by Thoughtful Therapy',
		});

		const userServerBlacklistEmbed = new EmbedBuilder()
			.setThumbnail('https://cdn.discordapp.com/attachments/1150258402157678664/1154182022613450804/Thoughtful_Therapy_Logo.png')
			.setTitle('TherapyBot Notification (Blacklisting)')
			.setDescription('This is a TherapyBot notification being sent to you on behalf of the Thoughtful Therapy Discord server to notify you that you have been blacklisted from Thoughtful Therapy. More information is located below:')
			.setColor('#77dd77')
			.addFields(
				{ name: 'Moderation Action:', value: `Blacklisting`, inline: false },
				{ name: 'Reason:', value: `${reason}`, inline: false },
				{ name: 'Evidence:', value: `${evidence}`, inline: false },
				{ name: 'Additional Information:', value: `You have been blacklisted from Thoughtful Therapy. This means that you can't enter or be in any area of Thoughtful Therapy operation including the main store. If you are found to enter the main store, you will be arrested for tresspassing in-game. If you are a staff member, you have automatically been terminated. If this blacklisting appears to be false, please contact a Manager+`, inline: false },
			);

		userServerBlacklistEmbed.setFooter({
			iconURL: 'https://cdn.discordapp.com/attachments/1150258402157678664/1154182022613450804/Thoughtful_Therapy_Logo.png',
			text: 'TherapyBot v1.7 Alpha, Operated by Thoughtful Therapy',
		});

		await interaction.reply({ content: 'Blacklist was successful, make sure to kick the user out of the group on Roblox too', ephemeral: true });
		await user_server.send({ embeds: [userServerBlacklistEmbed] });
		await blacklistChannel.send({ embeds: [serverBlacklistChannelEmbed] });
		await modLogChannel.send({ embeds: [serverblacklistLogEmbed] });
		await interaction.guild.members.ban(user_server);
		
		} else if(user_rblx && !user_server){
		//Noblox for Rblx Users
		const user_rblx_usernameID = await noblox.getIdFromUsername(user_rblx);
		let user_rblx_avatar_start = await noblox.getPlayerThumbnail(user_rblx_usernameID, 420, "png", true, "Headshot");
		let user_rblx_avatar_Final = user_rblx_avatar_start[0].imageUrl;
				//Blacklist Embeds for Roblox Users
				const rblxBlacklistChannelEmbed = new EmbedBuilder()
				.setThumbnail(user_rblx_avatar_Final)
				.setTitle('New User Blacklisted')
				.setDescription('A new user has been blacklisted, more information is located below:')
				.setColor('#77dd77')
				.addFields(
					{ name: 'Blacklist ID:', value: `${modID}`, inline: false },
					{ name: 'User Blacklisted:', value: `${user_rblx}`, inline: false },
					{ name: 'Reason:', value: `${reason}`, inline: false },
					{ name: 'Evidence:', value: `${evidence}`, inline: false },
					{ name: 'Additional Information:', value: `${user_rblx} has been blacklisted from Thoughtful Therapy. This means that they can't enter the store or be in any area of Thoughtful Therapy operation. If you see the user on Thoughtful Therapy property, in an area of company operation, or is harassing the company, contact a Manager+. If this blacklisting is false, please contact a Manager+.`},
				);
		
				rblxBlacklistChannelEmbed.setFooter({
					iconURL: 'https://cdn.discordapp.com/attachments/1150258402157678664/1154182022613450804/Thoughtful_Therapy_Logo.png',
					text: 'TherapyBot v1.7 Alpha, Operated by Thoughtful Therapy',
				});
		
				const userRBLXBlacklistLogEmbed = new EmbedBuilder()
				.setThumbnail('https://cdn.discordapp.com/attachments/1150258402157678664/1154182022613450804/Thoughtful_Therapy_Logo.png')
				.setTitle('Moderation Log (Blacklisting)')
				.setDescription('This is a moderation log used to notify that a user has been blacklisted from Thoughtful Therapy, DO NOT DELETE THIS LOG')
				.setColor('#77dd77')
				.addFields(
					{ name: 'Moderation Action:', value: `Blacklisting`, inline: false },
					{ name: 'Log ID:', value: `${modID}`, inline: false },
					{ name: 'User Blacklisted:', value: `${user_rblx}`, inline: false },
					{ name: 'Reason:', value: `${reason}`, inline: false },
					{ name: 'Evidence:', value: `${evidence}`, inline: false },
					{ name: 'Moderator:', value: `${interaction.member.displayName}`, inline: false },
					{ name: 'Additional Information:', value: `${user_rblx} has been blacklisted from all areas of Thoughtful Therapy operation including the main store. If the user enters the main store or an area of operation, please take moderation action against them and call the in-game police to tresspass them. If the user was an employee, they have already been terminated. If this blacklisting appears to be false, please contact a Represenative+.`, inline: false },
				);
		
			userRBLXBlacklistLogEmbed.setFooter({
				iconURL: 'https://cdn.discordapp.com/attachments/1150258402157678664/1154182022613450804/Thoughtful_Therapy_Logo.png',
				text: 'TherapyBot v1.7 Alpha, Operated by Thoughtful Therapy',
			});
			await interaction.reply({ content: 'Blacklist was successful, please contact the user if you can to notify them that they have been blacklisted (make sure to include the reason, the evidence, and what it means to be blacklisted)', ephemeral: true });
			await blacklistChannel.send({ embeds: [rblxBlacklistChannelEmbed] });
			await modLogChannel.send({ embeds: [userRBLXBlacklistLogEmbed] });
		} else if (!evidence || !reason){
			await interaction.reply({ content: 'REQUIRED OPTION(S) EMPTY (ERROR_200)', ephemeral: true });
		}else if(!user_server && !user_rblx){
			await interaction.reply({ content: 'REQUIRED OPTION(S) EMPTY (ERROR_200)', ephemeral: true });
		} else{
			await interaction.reply({ content: 'UNKNOWN EXECUTION ERROR, CONTACT A DEVELOPER FOR MORE INFORMATION (ERROR_750)', ephemeral: true });
		}

	},
};