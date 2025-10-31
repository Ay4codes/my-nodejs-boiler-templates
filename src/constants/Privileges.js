export const PRIVILEGES = [
    
    { name: "CREATE_USER", description: "Allows creating new user accounts" },
        
    { name: "VIEW_USER", description: "Allows viewing user details" },
    
    { name: "UPDATE_USER", description: "Allows updating personal information" },

    { name: "UPDATE_USERS", description: "Allows updating users information" },

    { name: "DEACTIVATE_USER", description: "Allows deactivating users account" },
    
    { name: "REACTIVATE_USER", description: "Allows reactivating users account" },
    
    { name: "DELETE_USER", description: "Allows deleting user accounts" },
    
    { name: "DISABLE_USER", description: "Allows enabling or disabling user accounts" },

    { name: "RESEND_ONBOARDING_LINK", description: "Allows resending onboarding link." },
    
    { name: "ASSIGN_ROLE", description: "Allows assigning roles from users" },
    
    { name: "REMOVE_ROLE", description: "Allows removing roles from users" },
    
    { name: "CREATE_ROLE", description: "Allows creating new roles" },
    
    { name: "VIEW_ROLE", description: "Allows viewing role details" },

    { name: "VIEW_ROLE_MEMBER", description: "Allows viewing role members" },
    
    { name: "VIEW_ROLE_HISTORY", description: "Allows viewing role history" },
    
    { name: "UPDATE_ROLE", description: "Allows updating role details" },
    
    { name: "DELETE_ROLE", description: "Allows deleting roles" },
    
    { name: "VIEW_PRIVILEGE", description: "Allows viewing privilege details" },
    
    { name: "UPDATE_PRIVILEGE", description: "Allows updating privilege details" },
    
    { name: "DELETE_PRIVILEGE", description: "Allows deleting privileges" },
    
    { name: "RESET_PASSWORD", description: "Allows initiating password resets" },
    
    { name: "CHANGE_PASSWORD", description: "Allows initiating change password" },
    
    { name: "VERIFY_EMAIL", description: "Allows verifying user emails" },
    
    { name: "VERIFY_IDENTITY", description: "Allows verifying user identities" },
    
    { name: "MANAGE_SYSTEM", description: "Allows managing system settings" },
    
    { name: "VIEW_AUDIT_LOGS", description: "Allows viewing system audit logs" },

    { name: "UPLOAD_MEDIA", description: 'Allows uploading media'},

    { name: "VIEW_MEDIA", description: 'Allows viewing media details'},

    { name: "UPDATE_MEDIA", description: 'Allows updating media details'},

    { name: "DELETE_MEDIA", description: 'Allows deleting media'},

    { name: "DOWNLOAD_MEDIA", description: 'Allows downloading media' },

    { name: "CONTACT_USER", description: 'Allows contacting user' },

];

export const DEFAULT_PRIVILEGES = [
    'VIEW_USER', 
    'UPDATE_USER', 
    'RESET_PASSWORD', 
    'VERIFY_EMAIL', 
    'CHANGE_PASSWORD', 
    'ONBOARD_USER', 
    'UPLOAD_MEDIA', 
    'VIEW_MEDIA', 
    'UPDATE_MEDIA',
    'DOWNLOAD_MEDIA'
];