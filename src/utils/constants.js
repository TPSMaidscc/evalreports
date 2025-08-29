// Authentication Configuration
export const AUTH_ENABLED = true; // Set to true to enable Google SSO, false to disable

// Approved email addresses (in addition to @maids.cc domain)
export const APPROVED_EMAILS = [
  'Samdean@gmail.com',
  'charbelchdid06@gmail.com'
];

// Dashboard configuration
export const dashboardConfig = {
  conversionFunnel: {
    enabled: true,
    enabledDepartments: ['AT Filipina', 'CC Sales', 'MV Sales'],
    notAvailableText: 'Pending business team',
    timeframe: 'Last 30 days'
  },
  lossOfInterestTable: {
    enabled: true,
    notAvailableText: 'Data not available',
    timeframe: 'Last 30 days',
    allowedDepartments: ['CC Sales', 'MV Sales']
  },
  trendlines: {
    cost: {
      enabled: true,
      notAvailableText: 'Data not available',
      timeframe: 'Last 30 days'
    },
    cvrWithin7Days: {
      enabled: true,
      notAvailableText: 'Pending Snowflake',
      timeframe: 'Last 30 days',
      allowedDepartments: ['CC Sales', 'MV Sales', 'AT Filipina', 'MaidsAT African', 'MaidsAT Ethiopian']
    },
    lossOfInterest: {
      enabled: false,
      notAvailableText: 'Pending Data',
      timeframe: 'Last 30 days',
      allowedDepartments: ['CC Sales', 'MV Sales', 'AT Filipina', 'MaidsAT African', 'MaidsAT Ethiopian'],
      enabledDepartments: ['CC Sales']
    },
    chatsWithRepetition: {
      enabled: true,
      notAvailableText: 'Data not available',
      timeframe: 'Last 30 days'
    },
    averageDelays: {
      enabled: true,
      notAvailableText: 'Data not available',
      timeframe: 'Last 30 days'
    },
    sentimentAnalysis: {
      enabled: true,
      notAvailableText: 'Data not available',
      timeframe: 'Last 30 days'
    },
    toolsPerformance: {
      enabled: false,
      notAvailableText: 'Data not available',
      timeframe: 'Last 30 days'
    },
    rulesAndPolicy: {
      enabled: false,
      notAvailableText: 'Data not available',
      timeframe: 'Last 30 days'
    }
  }
};

// Tooltip content for code-based evaluations
export const codeBasedEvalTooltips = {
  'META Quality': 'Current Quality Rating for the phone number (High, Medium, or Low)',
  'META Quality for 97145810691': 'Current Quality Rating for the phone number (High, Medium, or Low)',
  'META Quality for 97145810641': 'Current Quality Rating for the phone number (High, Medium, or Low)',
  'Spam warnings last 7 days': 'Number of spam warnings in the last 7 days',
  'LLM Model used': 'Current language model used by the chatbot',
  'LLM Backup Model': 'Backup language model used by the chatbot in case of main model failure',
  'Messages by backup': 'Number and percentage of messages sent by the backup model when the primary model was unavailable',
  'Reason for using the model': 'Reason why we chose this model among all models',
  'Chatbot prompt type': 'How the chatbot prompt is configured: based on policy rules or Q&As to generate the responses',
  'N8N/ERP': 'Whether the chatbot is operating on n8n or ChatAI',
  'Cost ($)': 'Total cost spent by the chatbot: Yesterday (Last 30 days)',
  'Chats supposed to be handled by bot (#)': '# of chats that started in the last 2 days and closed yesteday, and either included at least one bot message or passed through the bot skill with 0 bot messages.',
  'Fully handled by bot %': 'Chats handled fully by the bot out of the chats supposed to be handled by bot (0 intervention from agents)',
  'Identical messages repeated % (Avg)': `- %: Chats with at least one repeated message out of the chats supposed to be handled by bot 
- Avg/Conv: Average of repeated messages (excluding the first message) per conversation`,
  '80% Message similarity %': `- %: Chats with messages having 80% or higher similarity out of the chats supposed to be handled by bot 
- Avg/Conv: Average of similar messages per conversation`,
  '50% Message similarity %': `- %: Chats with messages having 50% or higher similarity out of the chats supposed to be handled by bot 
- Avg/Conv: Average of similar messages per conversation`,
  'Avg Delay - Initial msg (sec)': 'Average time in seconds for the bot initial message to be sent, excluding delays above 4 mins',
  'Avg Delay - non-initial msg (sec)': 'Average time in seconds for bot non-initial messages to be sent, excluding delays above 4 mins',
  '7D cohort - 3DW %': 'Conversion rate for prospects who contacted us during the 7-day period ending 3 days ago, allowing each a 3-day window to convert.',
  'Rule-breaking %': 'Chats in which the bot violated at least 1 core chatbot rules out of all chats',
  'Sentiment analysis (/5)': 'Weighted average customer satisfaction score based on AI analysis of conversation emotional states, using custom weights to emphasize different satisfaction levels',
  'Transfers due to escalations %': 'Transferred chats due to user\'s frustration and escalation out of all transfers',
  'Transfers due to known flows %': 'Transferred chats due to missing GPT flows out of all transfers',
  'False Promises %': 'Percentage of chats where the bot made false promises to customers',

  'Wrong tool called %': 'Tools called when they shouldn\'t have been, or that should have called other tools instead out of the # of tools called',
  'Missed to be called %': 'Tools that should\'ve been called but were never called out of the # of tools supposed to be called',
  'Missing policy %': '# of chats with wrong answers due to at least 1 policy missed out of all chats',
  'Unclear policy %': '# of chats with wrong answers due to at least 1 unclear policy out of all chats',
  'Wrong Answers %': '# of chats with wrong answers because bot contradicted a policy out of all chats',
  'FTR': '# of actionable chats successfully resolved on the first interaction, without the client returning with the same request on the same day, out of all chats.',
  'Medical mis-prescriptions': '# of wrong prescriptions out of all the prescriptions sent by the bot',
  'Unnecessary clinic recommendations': '# of clinic recommendations sent when the user could',
  'Chats shadowed %': '# of chats shadowed by the agents within 24 hrs after closing the chat out of all chats eligible to be shadowed, excluding any chat with no GPT message',
  'Reported issue (#)': '# of unique chats with reported issues out of all the chats shadowed',
  'Issues pending to be solved (#)': '# of issues reported and not solved yet',
  'Unresponsive Chats (%)': 'Percentage of chats where the bot becomes unresponsive and does not reply to consumer messages',
  'Policy to cause escalation %': '# of chats where customers expressed dissatisfaction or frustration due to policy-related responses out of chats supposed to be handled by bot',
  'Clients Questioning Legalties %': '- # of chats in which the client raises questions around legal compliance or regulations out of chats supposed to be handled by bot\n- # of escalated clients out of the clients questioning legalities',
  'Clarification Requested %': '# of messages where the customer asked clarifying questions following the bot\'s response out of all messages sent by the customer',
  'Call Request %': '- # of chats where customer requested a phone call out of chats supposed to be handled by bot\n- # of escalated clients out of the clients who requested calls',
  'Clients Suspecting AI %': '# of chats where the client suspected they were speaking to an AI or explicitly requested a human agent out of chats supposed to be handled by bot',
  'Threatening Case Identifier %': '# of chats where the client threatened legal or regulatory action against the company out of chats supposed to be handled by bot',
  'Shadowing Breakdown': 'Breakdown of chat shadowing by individual agents, showing the number of chats each agent reviewed',
  // New metrics for CC Sales and MV Sales only
  'Minimum Reply Time (sec)': 'Minimum time in seconds for the bot to reply to customer messages',
  'Call Requests Metric %': 'Percentage of chats where customers requested a phone call',
  'In-Chat Poke Re-engagement (%)': 'Overall percentage of chats with in-chat poke re-engagement from any source',
  'In-Chat Bot Poke Re-engagement': 'Number of chats with re-engagement specifically from bot pokes',
  'In-Chat Bot M20 Poke Re-engagement': 'Number of chats with re-engagement from bot M20 pokes',
  'In-Chat Agent Poke Re-engagement': 'Number of chats with re-engagement specifically from agent pokes',
  'Chats with at least 5 agent messages': 'Number of chats that included at least five messages from a human agent',
  'Chats with at least 2 agent messages': 'Number of chats that included at least two messages from a human agent',
  'Chats with at least 3 agent messages': 'Number of chats that included at least three messages from a human agent',
  'Static messages  %': 'Percentage of repeated messages that are static',
  'Dynamic messages  %': 'Percentage of repeated messages that are dynamic',
  'Static messages %': 'Percentage of messages having 50% or higher similarity that are static',
  'Dynamic messages %': 'Percentage of messages having 50% or higher similarity that are dynamic',
  'Agent Intervention %': '# of messages sent by agents (excluding agent pokes) out of all messages in the chats supposed to be handled by bot',
  'Backup model messages sent #(%)': '- #: # of messages sent by the backup model due to failure in the main model\n- %: # of messages sent by the backup model out of all the messages sent in the chats supposed to be handled by bot',
  'Fully Handled by bot (excluding agent pokes)': 'Number of chats that were fully handled by the bot without any agent intervention, excluding agent pokes'
};

// AT Filipina sub-departments configuration
export const AT_FILIPINA_SUB_DEPARTMENTS = {
  'All': {
    label: 'All (Combined)',
    snapshot: process.env.REACT_APP_AT_FILIPINA_SNAPSHOT_SHEET_ID,
    raw: '1xb9jRjWF7VJZDiRGA6XNlBUOjo8pm1Du4t6oQf2cdwo'
  },
  'Inside UAE': {
    label: 'Inside UAE',
    snapshot: '1eMNRy8NXesSsgAGbB6_VccNto84dp8FL4v4K88ZF2mU',
    raw: '1virNUMTDQMQsaJ698TVhqC61Y9-Sk2PErbfSd83CVVI'
  },
  'Outside UAE': {
    label: 'Outside UAE', 
    snapshot: '1Z1s38fRAjF-Zpocw17PM9BtMlO3bFoXWILeBqmQr8WI',
    raw: '1Sdxt4meG1xCGVk3x21AjhU6m87Qi_9IYSOUkFBC4zwY'
  },
  'In Philippines': {
    label: 'In Philippines',
    snapshot: '15CIBsfhdmnIMyA1psZ-WAgQySvxCYKjmrWvUrVbfjt8', 
    raw: '1d8IsQZNdo7-v6RqMGcFpozgcrZvvdpmXII-kKuJYzMY'
  }
};

// Department list
export const departments = [
  'All Chatbots Summary',
  'MV Resolvers',
  'Doctors',
  'AT Filipina',
  'CC Sales',
  'Delighters',
  'CC Resolvers',
  'MV Sales',
  'MaidsAT African',
  'MaidsAT Ethiopian',
  'LLM Cost Analysis'
];

// Display name to data key mapping
export const dataKeyMapping = {
  'Cost ($)': 'Cost',
  'Chats supposed to be handled by bot (#)': 'Total Number of Chats',
  'Identical messages repeated % (Avg)': 'Repetition %',
  '80% Message similarity %': '80% similarity',
  '50% Message similarity %': '50% similarity',
  'Avg Delay - Initial msg (sec)': 'Avg Delay - Initial msg',
  'Avg Delay - non-initial msg (sec)': 'Avg Delay - non-initial msg',
  'Fully handled by bot %': 'Handling %',
  'Fully Handled by bot (excluding agent pokes)': 'Fully Handled by bot (excluding agent pokes)',
  'Rule-breaking %': 'Rule Breaking',
  'Sentiment analysis (/5)': 'Sentiment Analysis',
  'Transfers due to escalations %': 'Transfers due to escalations',
  'Transfers due to known flows %': 'Transfers due to known flows',
  'False Promises %': '% False Promises',

  'Wrong tool called %': 'Wrong tool called',
  'Missed to be called %': 'Missed to be called',
  'Missing policy %': 'Missing policy',
  'Unclear policy %': 'Unclear policy',
  'Wrong Answers %': 'Wrong policy',
  'Chats shadowed %': '% chats shadowed',
  'Reported issue (#)': 'Reported issue',
  'Issues pending to be solved (#)': 'Issues pending to be solved',
  'Engagement from poking %': '% Engagement for filler',
  '7D cohort - 3DW %': '7DR-3DW',
  'First Time resolution on actionable chats %': 'FTR',
  'Policy to cause escalation %': 'Policy to cause escalation',
  'Clarification Requested %': 'Clarity Score',
  'Clients Suspecting AI %': 'Clients Suspecting AI',
  'Clients Questioning Legalties %': 'Clients Questioning Legalties',
  'Call Request %': 'Call Request',
  'Rebuttal Result %': 'Rebuttal Result',
  'Threatening Case Identifier %': 'Threatening Case Identifier',
  'Escalation Outcome': 'Escalation Outcome',
  'Shadowing breakdown': 'Shadowing breakdown'
}; 