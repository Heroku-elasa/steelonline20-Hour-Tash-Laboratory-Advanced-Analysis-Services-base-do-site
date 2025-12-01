
import React from 'react';

const SchemaMarkup: React.FC<{ schema: object }> = ({ schema }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default SchemaMarkup;
