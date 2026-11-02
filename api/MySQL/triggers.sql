DELIMITER $$

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END $$

CREATE TRIGGER update_jobs_timestamp
BEFORE UPDATE ON jobs
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END $$

CREATE TRIGGER before_company_delete
BEFORE DELETE ON companies
FOR EACH ROW
BEGIN
    -- Delete all jobs linked to job_sources of this company
    DELETE FROM jobs WHERE source_id IN 
        (SELECT source_id FROM job_sources WHERE company_id = OLD.company_id);
    
    -- Delete all job_sources of this company
    DELETE FROM job_sources WHERE company_id = OLD.company_id;
END $$

DELIMITER ;
