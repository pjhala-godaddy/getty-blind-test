import { Business } from '../types';
import '../styles/BusinessCard.css';

interface BusinessCardProps {
  business: Business;
}

function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="business-card">
      <div className="business-name">
        <span className="name">{business.name}</span>
        {business.industry && (
          <span className="industry">({business.industry})</span>
        )}
      </div>
      
      {business.description && (
        <div className="business-description">{business.description}</div>
      )}
      
      {(business.writing_style || business.content_style) && (
        <div className="metadata">
          {business.writing_style && (
            <div className="metadata-item">
              Writing Style: <span>{business.writing_style}</span>
            </div>
          )}
          {business.content_style && (
            <div className="metadata-item">
              Content Style: <span>{business.content_style}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BusinessCard;

