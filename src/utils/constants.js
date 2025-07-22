// Dashboard configuration
export const dashboardConfig = {
  conversionFunnel: {
    enabled: false,
    enabledDepartments: ['AT Filipina'],
    notAvailableText: 'Pending business team',
    timeframe: 'Till 17 July'
  },
  lossOfInterestTable: {
    enabled: true,
    notAvailableText: 'Data not available',
    timeframe: '1 week',
    allowedDepartments: ['CC Sales', 'MV Sales']
  },
  trendlines: {
    cost: {
      enabled: true,
      notAvailableText: 'Data not available',
      timeframe: '1 week'
    },
    cvrWithin7Days: {
      enabled: false,
      notAvailableText: 'Pending Snowflake',
      timeframe: '1 week',
      allowedDepartments: ['CC Sales', 'MV Sales', 'AT Filipina', 'MaidsAT African', 'MaidsAT Ethiopian']
    },
    lossOfInterest: {
      enabled: false,
      notAvailableText: 'Pending Data',
      timeframe: '1 week',
      allowedDepartments: ['CC Sales', 'MV Sales', 'AT Filipina', 'MaidsAT African', 'MaidsAT Ethiopian'],
      enabledDepartments: ['CC Sales']
    },
    chatsWithRepetition: {
      enabled: true,
      notAvailableText: 'Data not available',
      timeframe: '1 week'
    },
    averageDelays: {
      enabled: true,
      notAvailableText: 'Data not available',
      timeframe: '1 week'
    },
    sentimentAnalysis: {
      enabled: true,
      notAvailableText: 'Data not available',
      timeframe: '4 days'
    },
    toolsPerformance: {
      enabled: false,
      notAvailableText: 'Data not available',
      timeframe: '1 week'
    },
    rulesAndPolicy: {
      enabled: false,
      notAvailableText: 'Data not available',
      timeframe: '1 week'
    }
  }
};

// Tooltip content for code-based evaluations
export const codeBasedEvalTooltips = {
  'META Quality': 'Current Quality Rating for the phone number (High, Medium, or Low)',
  'META Quality for 97145810691': 'Current Quality Rating for the phone number (High, Medium, or Low)',
  'META Quality for 97145810641': 'Current Quality Rating for the phone number (High, Medium, or Low)',
  'LLM Model used': 'Current language model used by the chatbot',
  'Reason for using the model': 'Reason why we chose this model among all models',
  'Chatbot prompt type': 'How the chatbot prompt is configured: based on policy rules or Q&As to generate the responses',
  'N8N/ERP': 'Whether the chatbot is operating on n8n or ChatAI',
  'Cost ($)': 'Total cost spent by the chatbot: Yesterday (Last 30 days)',
  'Total Number of Chats (#)': '# of chats that started in the last 2 days and closed yesteday, and either included at least one bot message or passed through the bot skill with 0 bot messages.',
  'Chats supposed to be handled by bot (#)': '# of chats that were either started and closed during the day or started earlier and closed during the day, and either included at least one bot message or passed through the bot skill with 0 bot messages.',
  'Fully handled by bot %': 'Chats handled fully by the bot out of the chats supposed to be handled by bot (0 intervention from agents)',
  'Verbatim messages repeated % (Avg)': `- %: Chats with at least one repeated message out of the chats supposed to be handled by bot 
- Avg/Conv: Average of repeated messages (excluding the first message) per conversation`,
  'Avg Delay - Initial msg (sec)': 'Average time in seconds for the bot initial message to be sent, excluding delays above 4 mins',
  'Avg Delay - non-initial msg (sec)': 'Average time in seconds for bot non-initial messages to be sent, excluding delays above 4 mins',
  '7D cohort - 3DW': 'Conversion rate for prospects who contacted us during the 7-day period ending 3 days ago, allowing each a 3-day window to convert.',
  'Rule-breaking %': 'Chats in which the bot violated at least 1 core chatbot rules out of all chats',
  'Sentiment analysis (/5)': 'Weighted average customer satisfaction score based on AI analysis of conversation emotional states, using custom weights to emphasize different satisfaction levels',
  'Transfers due to escalations %': 'Transferred chats due to user\'s frustration and escalation out of all transfers',
  'Transfers due to known flows %': 'Transferred chats due to missing GPT flows out of all transfers',
  'Wrong tool called %': 'Tools called when they shouldn\'t have been, or that should have called other tools instead out of the # of tools called',
  'Missed to be called %': 'Tools that should\'ve been called but were never called out of the # of tools supposed to be called',
  'Missing policy %': '# of chats with wrong answers due to at least 1 policy missed out of all chats',
  'Unclear policy %': '# of chats with wrong answers due to at least 1 unclear policy out of all chats',
  'First Time resolution on actionable chats': '# of actionable chats successfully resolved on the first interaction, without the client returning with the same request on the same day, out of all chats.',
  'Medical mis-prescriptions': '# of wrong prescriptions out of all the prescriptions sent by the bot',
  'Unnecessary clinic recommendations': '# of clinic recommendations sent when the user could',
  'Chats shadowed %': '# of chats shadowed by the agents within 24 hrs after closing the chat out of all chats eligible to be shadowed, excluding any chat with no GPT message',
  'Reported issue (#)': '# of unique chats with reported issues out of all the chats shadowed',
  'Issues pending to be solved (#)': '# of issues reported and not solved yet',
  'Unresponsive Chats (%)': 'Percentage of chats where the bot becomes unresponsive and does not reply to consumer messages'
};

// Department list
export const departments = [
  'MV Resolvers',
  'Doctors',
  'AT Filipina',
  'CC Sales',
  'Delighters',
  'CC Resolvers',
  'MV Sales',
  'MaidsAT African',
  'MaidsAT Ethiopian'
];

// Display name to data key mapping
export const dataKeyMapping = {
  'Cost ($)': 'Cost',
  'Total Number of Chats (#)': 'Total Number of Chats',
  'Verbatim messages repeated % (Avg)': 'Repetition %',
  'Avg Delay - Initial msg (sec)': 'Avg Delay - Initial msg',
  'Avg Delay - non-initial msg (sec)': 'Avg Delay - non-initial msg',
  'Fully handled by bot %': 'Handling %',
  'Rule-breaking %': 'Rule Breaking',
  'Sentiment analysis (/5)': 'Sentiment Analysis',
  'Transfers due to escalations %': 'Transfers due to escalations',
  'Transfers due to known flows %': 'Transfers due to known flows',
  'Wrong tool called %': 'Wrong tool called',
  'Missed to be called %': 'Missed to be called',
  'Missing policy %': 'Missing policy',
  'Unclear policy %': 'Unclear policy',
  'Chats shadowed %': '% chats shadowed',
  'Reported issue (#)': 'Reported issue',
  'Issues pending to be solved (#)': 'Issues pending to be solved',
  'Engagement from poking %': '% Engagement for filler',
  '7D cohort - 3DW': '7DR-3DW'
}; 