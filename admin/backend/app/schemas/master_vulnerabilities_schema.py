from pydantic import BaseModel, Field, AnyUrl
from typing import Annotated

class master_vulnerabilities_Schema(BaseModel):
    vulnerability_name:Annotated[
        str,
        Field(
            max_length=100,
            description="Vulnerability Name",
            default="IDOR"
        )
    ]
    cvss_vector:Annotated[
        str,
        Field(
            max_length=50,
            description="Vulnerability Severity",
            default="CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
        )
    ]
    cwe_id:Annotated[
        str,
        Field(
            max_length=10,
            description="CWE-XXX",
            default="CWE-693"
        )
    ]
    description:Annotated[
        str,
        Field(
            max_length=500,
            description="Vulnerability description",
            default="Privilege Escalation part"
        )
    ]
    remediation:Annotated[
        str,
        Field(
            max_length=500,
            description="Vulnerability Remediation",
            default="Privilege Escalation Remediation"
        )
    ]
    impact:Annotated[
        str,
        Field(
            max_length=500,
            description="Vulnerability impact",
            default="Privilege Escalation impact"
        )
    ]
    reference: Annotated[
        AnyUrl,
        Field(
            max_length=100,
            description="Vulnerability Link",
            default="http://owasp.com"
        )
    ]

class master_vulnerabilities_Schema_Response(BaseModel):
    vid:Annotated[
        str,
        Field(
            default="VID-5096"
        )
    ]
    vulnerability_name:str
    cvss_score: float = None
    severity: str = None
    cvss_vector:str
    cwe_id:str
    description:str
    remediation:str
    impact:str
    reference:AnyUrl

