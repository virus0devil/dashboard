from app.core.database import Base
from sqlalchemy import Column, String, Float
import random

class GenerateVID:
    @staticmethod
    def generate():
        return f"VID-{random.randint(0, 9999):04d}"

class master_vulnerabilities_Models(Base):
    __tablename__ = "master_vulnerabilities"

    vid = Column(String(20), primary_key=True, default=GenerateVID.generate)
    vulnerability_name = Column(String(100))
    category = Column(String(20))
    cvss_score = Column(Float(20))
    severity = Column(String(10))
    cvss_vector = Column(String(50))
    cwe_id = Column(String(20))
    description = Column(String(500))
    remediation = Column(String(500))
    impact = Column(String(500))
    reference = Column(String(500))